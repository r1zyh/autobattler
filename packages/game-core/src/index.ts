export const test = 'game-core works';

type Status = "alive" | "dead" | "idle";

interface Card {
    id: number;
    attack: number;
    health: number;
    status: Status;
}


const TEAM_A: Card[] = [
    {id: 1, attack: 3, health: 2, status: "idle"},
    {id: 2, attack: 1, health: 1, status: "idle"},
    {id: 3, attack: 5, health: 4, status: "idle"},
    {id: 4, attack: 2, health: 6, status: "idle"},
    {id: 5, attack: 7, health: 3, status: "idle"},
    {id: 6, attack: 2, health: 2, status: "idle"},
    {id: 7, attack: 4, health: 5, status: "idle"},
];

const TEAM_B: Card[] = [
    {id: 1, attack: 3, health: 2, status: "idle"},
    {id: 2, attack: 1, health: 1, status: "idle"},
    {id: 3, attack: 5, health: 4, status: "idle"},
    {id: 4, attack: 2, health: 6, status: "idle"},
    {id: 5, attack: 7, health: 3, status: "idle"},
    {id: 6, attack: 2, health: 2, status: "idle"},
    {id: 7, attack: 4, health: 5, status: "idle"},
];

export function resolveAttack(attacker: Card, defender: Card) {
    defender.health -= attacker.attack;

    if (defender.health <= 0) {
        defender.status = "dead";
        return;
    }

    attacker.health -= defender.attack;
    if (attacker.health <= 0) {
        attacker.status = "dead";
    }
}

export function getRandomAlive(team: Card[]) {
    const alive = team.filter((card => card.status !== "dead"));
    return alive[Math.floor(Math.random() * alive.length)];
}

export function getAliveCards(team: Card[]) {
    return team.filter((card) => card.status !== "dead")
}

export function battle(teamA: Card[], teamB: Card[]) {
    const A = teamA.map((card) => ({
        ...card,
        status: "alive" as Status,
    }));

    const B = teamB.map((card) => ({
        ...card,
        status: "alive" as Status,
    }));

    const rounds: Array<{
        attackerId: number;
        defenderId: number;
        attackerDamage: number;
        attackerHealth: number;
        defenderDamage: number;
        defenderHealth: number;
    }> = [];

    while (true) {
        const aliveA = getAliveCards(A);
        const aliveB = getAliveCards(B);

        if (aliveA.length === 0) {
            return {
                winner: "teamB",
                rounds,
                finalState: {
                    teamA: A,
                    teamB: B,
                },
            };
        }

        if (aliveB.length === 0) {
            return {
                winner: "teamA",
                rounds,
                finalState: {
                    teamA: A,
                    teamB: B,
                },
            };
        }

        for (const attacker of [...aliveA]) {
            const targets = getAliveCards(B);

            if (targets.length === 0) {
                return {
                    winner: "teamA",
                    rounds,
                    finalState: {
                        teamA: A,
                        teamB: B,
                    },
                };
            }

            const defender = getRandomAlive(targets);

            const attackerBefore = attacker.health;
            const defenderBefore = defender.health;

            resolveAttack(attacker, defender);

            rounds.push({
                attackerId: attacker.id,
                defenderId: defender.id,
                attackerHealth: attacker.health - defender.attack,
                attackerDamage: attackerBefore - attacker.health,
                defenderDamage: defenderBefore - defender.health,
                defenderHealth: defender.health - attacker.attack,
            });
        }
    }
}

export const battleResult = battle(TEAM_A, TEAM_B);