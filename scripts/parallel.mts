/**
 * RÉPARTIR LES PREUVES SUR LES CŒURS.
 *
 * Rejouer cent énigmes, puis prouver que quinze d'entre elles résistent sans
 * rotation, prend près d'une heure en série — et un contrôle qu'on ne lance
 * plus ne protège de rien. Ces preuves sont pourtant indépendantes : rien ne
 * les oblige à s'attendre.
 *
 * Le père garde une file, chaque fils redemande du travail dès qu'il a fini.
 * Les niveaux « impossibles » coûtent dix fois les autres ; une répartition
 * fixe laisserait la moitié des cœurs oisifs à attendre le dernier lot.
 *
 * ⚠️ Un fils met une à deux secondes à démarrer — il reconstruit les cent
 * énigmes. D'où des fils DURABLES à qui l'on parle, plutôt qu'un processus par
 * tâche.
 */
import { fork } from 'node:child_process';
import { availableParallelism } from 'node:os';

/** Combien de fils lancer. On laisse deux cœurs à la machine : le père, et de
 *  quoi ne pas figer la session de qui lance le contrôle. */
export function laneCount(jobs: number): number {
    return Math.max(1, Math.min(jobs, availableParallelism() - 2));
}

/**
 * Exécute `jobs` sur des processus fils, et remet chaque verdict à `onResult`
 * DÈS QU'IL ARRIVE — dans l'ordre d'achèvement, pas celui de la file.
 *
 * `here` est le script lui-même : il est relancé avec `--worker`, à lui de
 * répondre aux messages reçus.
 */
export async function fanOut<Job, Result>(
    here: string,
    jobs: readonly Job[],
    onResult: (result: Result, job: Job) => void,
): Promise<void> {
    const queue = jobs.map((job, index) => ({ job, index }));
    let next = 0;

    await Promise.all(
        Array.from({ length: laneCount(jobs.length) }, () =>
            new Promise<void>((accept, reject) => {
                const worker = fork(here, ['--worker'], { execArgv: process.execArgv });
                let pending: (typeof queue)[number] | null = null;

                const give = () => {
                    pending = next < queue.length ? queue[next++]! : null;
                    if (pending) worker.send(pending.job);
                    else worker.disconnect();
                };

                worker.on('message', (message) => {
                    if (pending) onResult(message as Result, pending.job);
                    give();
                });
                worker.on('error', reject);
                worker.on('exit', (code) => {
                    if (pending) reject(new Error(`un fils est mort en cours de tâche (code ${code})`));
                    else if (code === 0 || code === null) accept();
                    else reject(new Error(`un fils est sorti avec le code ${code}`));
                });

                give();
            }),
        ),
    );
}

/** Le fils : répond à chaque tâche reçue, et s'arrête quand le père raccroche. */
export function serveWorker<Job, Result>(run: (job: Job) => Result): void {
    process.on('message', (job) => {
        process.send?.(run(job as Job) as object);
    });
    process.on('disconnect', () => process.exit(0));
}
