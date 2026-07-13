// Stil za obarvani del
const stilBarva = "color: #ffd200;";

// Stil za ponastavitev (privzeta barva konzole)
const stilReset = "color: inherit; line-height: 1;";

// Stil za ponastavitev (privzeta barva konzole)
const dancing = "line-height: 10;";

const radovednez = `Pozdravljen, Radovednež! 

Lep dan želim,
`;

// Zgornja "vrstica" (MIHA)
const zgornjiDel = `
    ███╗   ███╗██╗██╗  ██╗ █████╗       
    ████╗ ████║██║██║  ██║██╔══██╗      
    ██╔████╔██║██║███████║███████║      
    ██║╚██╔╝██║██║██╔══██║██╔══██║      
    ██║ ╚═╝ ██║██║██║  ██║██║  ██║      
    ╚═╝     ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝                                                           
`;

// Spodnja "vrstica" (KNIFIC)
const spodnjiDel = `
██╗  ██╗███╗   ██╗██╗███████╗██╗ ██████╗
██║ ██╔╝████╗  ██║██║██╔════╝██║██╔════╝
█████╔╝ ██╔██╗ ██║██║█████╗  ██║██║     
██╔═██╗ ██║╚██╗██║██║██╔══╝  ██║██║     
██║  ██╗██║ ╚████║██║██║     ██║╚██████╗
╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝     ╚═╝ ╚═════╝

⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐
 (•w•)   (•u•)   (•o•)   (•‿•)
<)   )╯ <)   )╯ <)   )╯  <)  )╯
All the single ladies (now put your hands up)
Whoa-oh-oh, oh-oh-oh, oh-oh-oh, oh-oh-oh 
`;
// Združen izpis v eni vrstici:
// %czgornjiDel -> Uporabi stil 'stilBarva'
// %cspodnjiDel -> Uporabi stil 'stilReset'
console.log(radovednez + "%c" + zgornjiDel + "%c" + spodnjiDel, stilBarva, stilReset);