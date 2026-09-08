import{a as e,i as t,n,o as r,r as i}from"./index-BDbMqaua.js";var a=r(e(),1),o=n(),s=({onSearch:e,onSearchEnter:n})=>{let{pathname:r}=t(),s=e=>r===e,c=(0,a.useRef)(null);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`style`,{children:`
          .navegacion .item {
            padding: 0.5rem 1rem;
            transition: all 0.2s ease;
            text-decoration: none;
            color: inherit;
          }
          .navegacion .item.activo { 
            background-color: #E0E0E0; 
            color: #000; 
            font-weight: 600; 
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            border-radius: 4px;
          }
        `}),(0,o.jsxs)(`div`,{className:`header`,children:[(0,o.jsx)(`h1`,{children:`Arcade`}),(0,o.jsxs)(`div`,{className:`contenedor-busqueda`,children:[(0,o.jsx)(`button`,{type:`button`,className:`boton-buscar`,"aria-label":`Buscar`,onClick:()=>{c.current&&n(c.current.value)},children:(0,o.jsxs)(`svg`,{width:`21`,height:`21`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,o.jsx)(`circle`,{cx:`11`,cy:`11`,r:`8`}),(0,o.jsx)(`path`,{d:`m21 21-4.35-4.35`})]})}),(0,o.jsx)(`input`,{ref:c,type:`text`,placeholder:`Search for anything`,className:`buscador`,onChange:t=>{e(t.target.value)},onKeyDown:e=>{e.key===`Enter`&&n(e.currentTarget.value)}})]}),(0,o.jsxs)(`nav`,{className:`navegacion`,children:[(0,o.jsx)(i,{to:`/`,className:`item ${s(`/`)?`activo`:``}`,children:`Inicio`}),(0,o.jsx)(i,{to:`/PlayStation`,className:`item ${s(`/PlayStation`)?`activo`:``}`,children:`PlayStation`}),(0,o.jsx)(i,{to:`/xbox`,className:`item ${s(`/xbox`)?`activo`:``}`,children:`Xbox`}),(0,o.jsx)(i,{to:`/nintendo`,className:`item ${s(`/nintendo`)?`activo`:``}`,children:`Nintendo`}),(0,o.jsx)(i,{to:`/favoritos`,className:`item ${s(`/favoritos`)?`activo`:``}`,children:`Mis favoritos`})]})]})]})};export{s as t};