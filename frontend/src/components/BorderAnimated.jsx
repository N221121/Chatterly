import React from "react";

function BorderAnimatedContainer({ children }) {

return (

    <div className="w-full h-full rounded-2xl border border-transparent animate-border flex overflow-hidden [background:linear-gradient(45deg,#172833,#1e293b_50%,#172833)_padding-box,conic-gradient(from_var(--border-angle),rgba(71,85,105,0.48)_80%,rgb(6,182,212)_86%,rgb(103,232,249)_90%,rgb(6,182,212)_94%,rgba(71,85,105,0.48))_border-box]">

    {children}

    </div>

);

}
export default BorderAnimatedContainer;