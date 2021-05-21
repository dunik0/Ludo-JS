
const startPositionsRed = [];
const startPositionsBlue = [];
const startPositionsGreen = [];
const startPositionsYellow = [];

for (let u = 0; u < 2; u++) {
    let pinOffsetTop = 391 * u + 16;
    for (let i = 0; i < 2; i++) {
        let pinOffsetLeft = 391 * i + 16;
        for (let o = 0; o < 2; o++) {
            let top = pinOffsetTop + o * 44;
            for (let p = 0; p < 2; p++) {
                let left = pinOffsetLeft + p * 44;
                if (i == 0 && u == 0) {
                    startPositionsRed.push({ top: top, left: left });
                } else if (i == 1 && u == 0) {
                    startPositionsBlue.push({ top: top, left: left });
                } else if (i == 1 && u == 1) {
                    startPositionsGreen.push({ top: top, left: left });
                } else if (i == 0 && u == 1) {
                    startPositionsYellow.push({ top: top, left: left });
                }
            }
        }
    }
}
export { startPositionsRed, startPositionsBlue, startPositionsGreen, startPositionsYellow }

export const positions = [
    { top: 234, left: 16 },

    { top: 190, left: 16 },
    { top: 190, left: 60 },
    { top: 190, left: 103 },
    { top: 190, left: 147 },
    { top: 190, left: 190 },
    { top: 146, left: 190 },
    { top: 103, left: 190 },
    { top: 59, left: 190 },
    { top: 16, left: 190 },
    { top: 16, left: 234 },
    { top: 16, left: 277 },
    { top: 59, left: 277 },
    { top: 103, left: 277 },
    { top: 146, left: 277 },
    { top: 190, left: 277 },
    { top: 190, left: 321 },
    { top: 190, left: 364 },
    { top: 190, left: 408 },
    { top: 190, left: 451 },
    { top: 234, left: 451 },
    { top: 277, left: 451 },
    { top: 277, left: 408 },
    { top: 277, left: 364 },
    { top: 277, left: 321 },
    { top: 277, left: 277 },
    { top: 321, left: 277 },
    { top: 364, left: 277 },
    { top: 408, left: 277 },
    { top: 451, left: 277 },
    { top: 451, left: 233 },
    { top: 451, left: 190 },
    { top: 408, left: 190 },
    { top: 364, left: 190 },
    { top: 321, left: 190 },
    { top: 277, left: 190 },
    { top: 277, left: 147 },
    { top: 277, left: 103 },
    { top: 277, left: 60 },
    { top: 277, left: 16 },
    { top: 234, left: 16 },

    { top: 190, left: 16 },
    { top: 190, left: 60 },
    { top: 190, left: 103 },
    { top: 190, left: 147 },
    { top: 190, left: 190 },
    { top: 146, left: 190 },
    { top: 103, left: 190 },
    { top: 59, left: 190 },
    { top: 16, left: 190 },
    { top: 16, left: 234 },
    { top: 16, left: 277 },
    { top: 59, left: 277 },
    { top: 103, left: 277 },
    { top: 146, left: 277 },
    { top: 190, left: 277 },
    { top: 190, left: 321 },
    { top: 190, left: 364 },
    { top: 190, left: 408 },
    { top: 190, left: 451 },
    { top: 234, left: 451 },
    { top: 277, left: 451 },
    { top: 277, left: 408 },
    { top: 277, left: 364 },
    { top: 277, left: 321 },
    { top: 277, left: 277 },
    { top: 321, left: 277 },
    { top: 364, left: 277 },
    { top: 408, left: 277 },
    { top: 451, left: 277 },
    { top: 451, left: 233 },
];

//     { top: 16, left: 16 },
//     { top: 16, left: 60 },
//     { top: 60, left: 16 },
//     { top: 60, left: 60 },
// ];

export const endPositionsRed = [
    { top: 234, left: 16 },

    { top: 234, left: 60 },
    { top: 234, left: 103 },
    { top: 234, left: 147 },
    { top: 234, left: 190 },
];


//     { top: 16, left: 451 },
//     { top: 16, left: 407 },
//     { top: 60, left: 451 },
//     { top: 60, left: 407 },
//  ];

export const endPositionsBlue = [
    { top: 16, left: 234 },

    { top: 59, left: 234 },
    { top: 103, left: 234 },
    { top: 146, left: 234 },
    { top: 190, left: 234 },
];


//     { top: 16, left: 234 },
//     { top: 16, left: 234 },
//     { top: 16, left: 234 },
//     { top: 16, left: 234 },
//  ];

export const endPositionsGreen = [
    { top: 234, left: 451 },

    { top: 234, left: 408 },
    { top: 234, left: 364 },
    { top: 234, left: 321 },
    { top: 234, left: 277 },
];


//     { top: 16, left: 234 },
//     { top: 16, left: 234 },
//     { top: 16, left: 234 },
//     { top: 16, left: 234 },
//  ];

export const endPositionsYellow = [
    { top: 451, left: 233 },

    { top: 408, left: 233 },
    { top: 364, left: 233 },
    { top: 321, left: 233 },
    { top: 277, left: 233 },
];