// Test-only direct statement translation from reference/algorithm.vba.
export const legacy = {};
legacy[1] = env => { let result="", Part1="", Part2="";
if (env['Ans12.Value'] === "Y" || env['Ans12.Value'] === "PY") {
if (env['Ans11.Value'] === "Y" || env['Ans11.Value'] === "PY" || env['Ans11.Value'] === "NI") {
if (env['Ans13.Value'] === "N" || env['Ans13.Value'] === "PN" || env['Ans13.Value'] === "NI") {
result = "Low";
} else if (env['Ans13.Value'] === "Y" || env['Ans13.Value'] === "PY") {
result = "Some concerns";
} else if (env['Ans13.Value'] === "") {
result = "Algorithm";
}
} else if (env['Ans11.Value'] === "N" || env['Ans11.Value'] === "PN") {
if (env['Ans13.Value'] === "Y" || env['Ans13.Value'] === "PY" || env['Ans13.Value'] === "N" || env['Ans13.Value'] === "PN" || env['Ans13.Value'] === "NI") {
result = "Some concerns";
} else if (env['Ans13.Value'] === "") {
result = "Algorithm";
}
}
} else if (env['Ans12.Value'] === "NI") {
if (env['Ans11.Value'] === "Y" || env['Ans11.Value'] === "PY" || env['Ans11.Value'] === "PN" || env['Ans11.Value'] === "N" || env['Ans11.Value'] === "NI") {
if (env['Ans13.Value'] === "N" || env['Ans13.Value'] === "PN" || env['Ans13.Value'] === "NI") {
result = "Some concerns";
} else if (env['Ans13.Value'] === "Y" || env['Ans13.Value'] === "PY") {
result = "High";
} else if (env['Ans13.Value'] === "") {
result = "Algorithm";
}
}
} else if (env['Ans12.Value'] === "N" || env['Ans12.Value'] === "PN") {
result = "High";
} else if (env['Ans11.Value'] === "" || env['Ans13.Value'] === "") {
result = "Algorithm";
}
return ["Low","Some concerns","High"].includes(result)?result:null;
};
legacy[2] = env => { let result="", Part1="", Part2="";
if (env['ComboBox13.Value'] === "" || env['Question21.Value'] === "") {
}
if (env['ComboBox13.Value'] === "assignment to intervention (the 'intention-to-treat' effect)") {
if ((env['Ans21.Value'] === "N" && env['Ans22.Value'] === "N") || (env['Ans21.Value'] === "N" && env['Ans22.Value'] === "PN") || (env['Ans21.Value'] === "PN" && env['Ans22.Value'] === "N") || (env['Ans21.Value'] === "PN" && env['Ans22.Value'] === "PN")) {
Part1 = "Low risk";
} else if (env['Ans21.Value'] === "Y" || env['Ans21.Value'] === "PY" || env['Ans21.Value'] === "NI" || env['Ans22.Value'] === "Y" || env['Ans22.Value'] === "PY" || env['Ans22.Value'] === "NI") {
if (env['Ans23.Value'] === "N" || env['Ans23.Value'] === "PN") {
Part1 = "Low risk";
} else if (env['Ans23.Value'] === "NI") {
Part1 = "Some concerns";
} else if (env['Ans23.Value'] === "Y" || env['Ans23.Value'] === "PY") {
if (env['Ans24.Value'] === "N" || env['Ans24.Value'] === "PN") {
Part1 = "Some concerns";
} else if (env['Ans24.Value'] === "NI" || env['Ans24.Value'] === "Y" || env['Ans24.Value'] === "PY") {
if (env['Ans25.Value'] === "Y" || env['Ans25.Value'] === "PY") {
Part1 = "Some concerns";
} else if (env['Ans25.Value'] === "N" || env['Ans25.Value'] === "PN" || env['Ans25.Value'] === "NI") {
Part1 = "High risk";
}
}
}
}
if (env['Ans26.Value'] === "Y" || env['Ans26.Value'] === "PY") {
Part2 = "Low risk";
} else if (env['Ans26.Value'] === "N" || env['Ans26.Value'] === "PN" || env['Ans26.Value'] === "NI") {
if (env['Ans27.Value'] === "N" || env['Ans27.Value'] === "PN") {
Part2 = "Some concerns";
} else if (env['Ans27.Value'] === "Y" || env['Ans27.Value'] === "PY" || env['Ans27.Value'] === "NI") {
Part2 = "High risk";
} else if (env['Ans27.Value'] === "") {
Part2 = "";
}
} else {
Part2 = "";
}
if (Part1 === "Low risk" && Part2 === "Low risk") {
result = "Low";
} else if (Part1 === "High risk" || Part2 === "High risk" && (Part1 !== "" && Part2 !== "")) {
result = "High";
} else {
if (Part1 !== "" && Part2 !== "") {
result = "Some concerns";
} else {
result = "Algorithm";
}
}
} else if (env['ComboBox13.Value'] === "adhering to intervention (the 'per-protocol' effect)") {
if ((env['Ans21.Value'] === "N" && env['Ans22.Value'] === "N") || (env['Ans21.Value'] === "N" && env['Ans22.Value'] === "PN") || (env['Ans21.Value'] === "PN" && env['Ans22.Value'] === "N") || (env['Ans21.Value'] === "PN" && env['Ans22.Value'] === "PN")) {
if ((env['Ans24.Value'] === "N" && env['Ans25.Value'] === "NA") || (env['Ans24.Value'] === "NA" && env['Ans25.Value'] === "N") || (env['Ans24.Value'] === "NA" && env['Ans25.Value'] === "PN") || (env['Ans24.Value'] === "PN" && env['Ans25.Value'] === "NA") || (env['Ans24.Value'] === "N" && env['Ans25.Value'] === "PN") || (env['Ans24.Value'] === "PN" && env['Ans25.Value'] === "N") || (env['Ans24.Value'] === "N" && env['Ans25.Value'] === "N") || (env['Ans24.Value'] === "PN" && env['Ans25.Value'] === "PN") || (env['Ans24.Value'] === "NA" && env['Ans25.Value'] === "NA")) {
result = "Low";
} else if (env['Ans24.Value'] === "Y" || env['Ans24.Value'] === "PY" || env['Ans24.Value'] === "NI" || env['Ans25.Value'] === "Y" || env['Ans25.Value'] === "PY" || env['Ans25.Value'] === "NI") {
if (env['Ans26.Value'] === "Y" || env['Ans26.Value'] === "PY") {
result = "Some concerns";
} else if (env['Ans26.Value'] === "N" || env['Ans26.Value'] === "PN" || env['Ans26.Value'] === "NI") {
result = "High";
}
}
} else if (env['Ans21.Value'] === "Y" || env['Ans21.Value'] === "PY" || env['Ans21.Value'] === "NI" || env['Ans22.Value'] === "Y" || env['Ans22.Value'] === "PY" || env['Ans22.Value'] === "NI") {
if (env['Ans23.Value'] === "Y" || env['Ans23.Value'] === "PY" || env['Ans23.Value'] === "NA") {
if ((env['Ans24.Value'] === "N" && env['Ans25.Value'] === "NA") || (env['Ans24.Value'] === "NA" && env['Ans25.Value'] === "N") || (env['Ans24.Value'] === "NA" && env['Ans25.Value'] === "PN") || (env['Ans24.Value'] === "PN" && env['Ans25.Value'] === "NA") || (env['Ans24.Value'] === "N" && env['Ans25.Value'] === "PN") || (env['Ans24.Value'] === "PN" && env['Ans25.Value'] === "N") || (env['Ans24.Value'] === "N" && env['Ans25.Value'] === "N") || (env['Ans24.Value'] === "PN" && env['Ans25.Value'] === "PN") || (env['Ans24.Value'] === "NA" && env['Ans25.Value'] === "NA")) {
result = "Low";
} else if (env['Ans24.Value'] === "Y" || env['Ans24.Value'] === "PY" || env['Ans24.Value'] === "NI" || env['Ans25.Value'] === "Y" || env['Ans25.Value'] === "PY" || env['Ans25.Value'] === "NI") {
if (env['Ans26.Value'] === "Y" || env['Ans26.Value'] === "PY") {
result = "Some concerns";
} else if (env['Ans26.Value'] === "N" || env['Ans26.Value'] === "PN" || env['Ans26.Value'] === "NI") {
result = "High";
}
}
} else if (env['Ans23.Value'] === "N" || env['Ans23.Value'] === "PN" || env['Ans23.Value'] === "NI") {
if (env['Ans26.Value'] === "PY" || env['Ans26.Value'] === "Y") {
result = "Some concerns";
} else if (env['Ans26.Value'] === "N" || env['Ans26.Value'] === "PN" || env['Ans26.Value'] === "NI") {
result = "High";
}
}
}
} else {
result = "Algorithm";
}
return ["Low","Some concerns","High"].includes(result)?result:null;
};
legacy[3] = env => { let result="", Part1="", Part2="";
if (env['Ans31.Value'] === "Y" || env['Ans31.Value'] === "PY") {
result = "Low";
} else if (env['Ans31.Value'] === "N" || env['Ans31.Value'] === "PN" || env['Ans31.Value'] === "NI") {
if (env['Ans32.Value'] === "Y" || env['Ans32.Value'] === "PY") {
result = "Low";
} else if (env['Ans32.Value'] === "N" || env['Ans32.Value'] === "PN" || env['Ans32.Value'] === "NI") {
if (env['Ans33.Value'] === "N" || env['Ans33.Value'] === "PN") {
result = "Low";
} else if (env['Ans33.Value'] === "Y" || env['Ans33.Value'] === "PY" || env['Ans33.Value'] === "NI") {
if (env['Ans34.Value'] !== "" && (env['Ans34.Value'] === "N" || env['Ans34.Value'] === "PN")) {
result = "Some concerns";
} else if (env['Ans34.Value'] !== "" && (env['Ans34.Value'] === "Y" || env['Ans34.Value'] === "PY" || env['Ans34.Value'] === "NI")) {
result = "High";
} else if (env['Ans34.Value'] === "") {
result = "Algorithm";
}
} else if (env['Ans33.Value'] === "") {
result = "Algorithm";
}
} else if (env['Ans32.Value'] === "") {
result = "Algorithm";
}
} else if (env['Ans31.Value'] === "") {
result = "Algorithm";
}
return ["Low","Some concerns","High"].includes(result)?result:null;
};
legacy[4] = env => { let result="", Part1="", Part2="";
if (env['Ans41.Value'] === "PY" || env['Ans41.Value'] === "Y" || env['Ans42.Value'] === "PY" || env['Ans42.Value'] === "Y" && (env['Ans43.Value'] !== "" || env['Ans44.Value'] !== "" || env['Ans45.Value'] !== "")) {
result = "High";
} else if (env['Ans41.Value'] === "N" || env['Ans41.Value'] === "PN" || env['Ans41.Value'] === "NI") {
if (env['Ans42.Value'] === "N" || env['Ans42.Value'] === "PN") {
if (env['Ans43.Value'] === "N" || env['Ans43.Value'] === "PN" && (env['Ans44.Value'] !== "" && env['Ans45.Value'] !== "")) {
result = "Low";
} else if (env['Ans43.Value'] === "Y" || env['Ans43.Value'] === "PY" || env['Ans43.Value'] === "NI") {
if (env['Ans44.Value'] === "N" || env['Ans44.Value'] === "PN" && env['Ans45.Value'] !== "") {
result = "Low";
} else if (env['Ans44.Value'] === "Y" || env['Ans44.Value'] === "PY" || env['Ans44.Value'] === "NI") {
if (env['Ans45.Value'] === "N" || env['Ans45.Value'] === "PN") {
result = "Some concerns";
} else if (env['Ans45.Value'] === "Y" || env['Ans45.Value'] === "PY" || env['Ans45.Value'] === "NI") {
result = "High";
} else if (env['Ans45.Value'] === "") {
result = "Algorithm";
}
} else if (env['Ans44.Value'] === "") {
result = "Algorithm";
}
} else if (env['Ans43.Value'] === "") {
result = "Algorithm";
}
} else if (env['Ans42.Value'] === "NI") {
if (env['Ans43.Value'] === "N" || env['Ans43.Value'] === "PN" && (env['Ans44.Value'] !== "" && env['Ans45.Value'] !== "")) {
result = "Some concerns";
} else if (env['Ans43.Value'] === "Y" || env['Ans43.Value'] === "PY" || env['Ans43.Value'] === "NI") {
if (env['Ans44.Value'] === "N" || env['Ans44.Value'] === "PN" && env['Ans45.Value'] !== "") {
result = "Some concerns";
} else if (env['Ans44.Value'] === "Y" || env['Ans44.Value'] === "PY" || env['Ans44.Value'] === "NI") {
if (env['Ans45.Value'] === "N" || env['Ans45.Value'] === "PN") {
result = "Some concerns";
} else if (env['Ans45.Value'] === "Y" || env['Ans45.Value'] === "PY" || env['Ans45.Value'] === "NI") {
result = "High";
} else if (env['Ans45.Value'] === "") {
result = "Algorithm";
}
} else if (env['Ans44.Value'] === "") {
result = "Algorithm";
}
} else if (env['Ans43.Value'] === "") {
result = "Algorithm";
}
}
}
return ["Low","Some concerns","High"].includes(result)?result:null;
};
legacy[5] = env => { let result="", Part1="", Part2="";
if ((env['Ans53.Value'] === "PN" && env['Ans52.Value'] === "PN") || (env['Ans53.Value'] === "N" && env['Ans52.Value'] === "N") || (env['Ans52.Value'] === "N" && env['Ans53.Value'] === "PN") || (env['Ans53.Value'] === "N" && env['Ans52.Value'] === "PN")) {
if (env['Ans51.Value'] === "Y" || env['Ans51.Value'] === "PY") {
result = "Low";
} else if (env['Ans51.Value'] === "N" || env['Ans51.Value'] === "PN" || env['Ans51.Value'] === "NI") {
result = "Some concerns";
}
} else if (env['Ans52.Value'] === "Y" || env['Ans52.Value'] === "PY" || env['Ans53.Value'] === "Y" || env['Ans53.Value'] === "PY" && env['Ans51.Value'] !== "") {
result = "High";
} else {
if (env['Ans51.Value'] !== "" && env['Ans52.Value'] !== "" && env['Ans53.Value'] !== "") {
result = "Some concerns";
} else {
result = "Algorithm";
}
}
return ["Low","Some concerns","High"].includes(result)?result:null;
};
legacy[6] = env => { let result="", Part1="", Part2="";
if (env['Judge1.Value'] === "Low" && env['Judge2.Value'] === "Low" && env['Judge3.Value'] === "Low" && env['Judge4.Value'] === "Low" && env['Judge5.Value'] === "Low") {
result = "Low";
}
if ("Some concerns" === env['Judge1.Value']) {
result = "Some concerns";
} else if ("Some concerns" === env['Judge2.Value']) {
result = "Some concerns";
} else if ("Some concerns" === env['Judge3.Value']) {
result = "Some concerns";
} else if ("Some concerns" === env['Judge4.Value']) {
result = "Some concerns";
} else if ("Some concerns" === env['Judge5.Value']) {
result = "Some concerns";
}
if ("High" === env['Judge1.Value']) {
result = "High";
} else if ("High" === env['Judge2.Value']) {
result = "High";
} else if ("High" === env['Judge3.Value']) {
result = "High";
} else if ("High" === env['Judge4.Value']) {
result = "High";
} else if ("High" === env['Judge5.Value']) {
result = "High";
}
return ["Low","Some concerns","High"].includes(result)?result:null;
};