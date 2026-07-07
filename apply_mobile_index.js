const fs = require('fs');
const path = 'c:\\Users\\Artur\\Downloads\\files\\index.html';
let html = fs.readFileSync(path, 'utf8');

// Fix Cart Sidebar
const oldCartCSS = `.cart-sidebar {
    position: fixed; top: 0; right: -450px; width: 400px; max-width: 100%; height: 100vh;
    background: white; box-shadow: -5px 0 25px rgba(0,0,0,0.15); z-index: 10000;
    transition: right 0.3s ease; display: flex; flex-direction: column;
    font-family: 'Inter', sans-serif;
  }
  .cart-sidebar.open { right: 0; }`;

const newCartCSS = `.cart-sidebar {
    position: fixed; top: 0; right: 0; width: 400px; max-width: 100vw; height: 100vh;
    background: white; box-shadow: -5px 0 25px rgba(0,0,0,0.15); z-index: 10000;
    transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex; flex-direction: column; font-family: 'Inter', sans-serif;
  }
  .cart-sidebar.open { transform: translateX(0); }`;

html = html.replace(oldCartCSS, newCartCSS);

// Fix Address Fields layout
const oldRow1 = `<div style="display:flex; gap:10px;">
            <input id="input-numero"`;
const newRow1 = `<div style="display:flex; flex-wrap:wrap; gap:10px;">
            <input id="input-numero" style="min-width:100px;"`;
html = html.replace(oldRow1, newRow1);

const oldRow2 = `<div style="display:flex; gap:10px;">
            <input id="input-bairro"`;
const newRow2 = `<div style="display:flex; flex-wrap:wrap; gap:10px;">
            <input id="input-bairro" style="min-width:120px;"`;
html = html.replace(oldRow2, newRow2);

html = html.replace('placeholder="Complemento" style="flex:2;', 'placeholder="Complemento" style="flex:2; min-width: 140px;');
html = html.replace('placeholder="Cidade" style="flex:1;', 'placeholder="Cidade" style="flex:1; min-width: 120px;');

fs.writeFileSync(path, html, 'utf8');
console.log('index.html mobile optimization done!');
