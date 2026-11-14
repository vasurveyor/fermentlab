"use client";
import {useRef,useState} from "react";
import {AlertTriangle,Pencil,Plus,RotateCcw,Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {UNITS,checkIngredient,isVolumeUnit,unitForSystem,type UnitSystem} from "@/lib/brewing";
import {FERMENTABLES,NUTRIENT_LEVELS,YEASTS,YEAST_TYPES,type IngredientPreset,type YeastProfile} from "@/lib/catalog";

type Props={
 system:UnitSystem;
 ingredients:IngredientPreset[];customIngredients:IngredientPreset[];setCustomIngredients:(fn:(x:IngredientPreset[])=>IngredientPreset[])=>void;
 yeasts:Record<string,YeastProfile>;customYeasts:Record<string,YeastProfile>;setCustomYeasts:(fn:(x:Record<string,YeastProfile>)=>Record<string,YeastProfile>)=>void;
};
type IngForm={name:string;category:string;unit:string;ppg:string;sugar:string;density:string;note:string};
type YeastForm={name:string;type:string;abvMin:string;abvMax:string;tempMin:string;tempMax:string;daysMin:string;daysMax:string;nutrient:string;uses:string;profile:string;note:string};
type Problem={level:"error"|"warn";message:string;suggestedPpg?:number};

const num=(v:string)=>v.trim()===""?NaN:Number(v);
const same=(a:string,b:string)=>a.trim().toLowerCase()===b.trim().toLowerCase();
const has=(o:object,k:string)=>Object.prototype.hasOwnProperty.call(o,k);
const emptyIng=(system:UnitSystem):IngForm=>({name:"",category:"My ingredients",unit:system==="metric"?"kg":"lb",ppg:"",sugar:"",density:"",note:""});
const emptyYeast:YeastForm={name:"",type:"Wine",abvMin:"",abvMax:"",tempMin:"",tempMax:"",daysMin:"",daysMax:"",nutrient:"Medium",uses:"",profile:"",note:""};

function Label({label,hint,children}:{label:string;hint?:string;children:React.ReactNode}){return <label className="lib-field"><span>{label}</span>{children}{hint&&<small>{hint}</small>}</label>}
function Problems({items,onUse}:{items:Problem[];onUse?:(ppg:number)=>void}){return items.length?<div className="lib-problems">{items.map(c=><p key={c.message} className={c.level}><AlertTriangle/><span>{c.message}</span>{c.suggestedPpg!==undefined&&onUse&&<button type="button" onClick={()=>onUse(c.suggestedPpg!)}>Use {c.suggestedPpg} PPG</button>}</p>)}</div>:null}

export default function LibraryTab({system,ingredients,customIngredients,setCustomIngredients,yeasts,customYeasts,setCustomYeasts}:Props){
 const [mode,setMode]=useState<"ingredients"|"yeasts">("ingredients"),[query,setQuery]=useState("");
 const [ing,setIng]=useState<IngForm>(emptyIng(system)),[editingIng,setEditingIng]=useState<string|null>(null);
 const [yst,setYst]=useState<YeastForm>(emptyYeast),[editingYeast,setEditingYeast]=useState<string|null>(null);
 const formRef=useRef<HTMLElement>(null);
 const reveal=()=>setTimeout(()=>formRef.current?.scrollIntoView({behavior:"smooth",block:"nearest"}),0);

 // ---- ingredients
 const builtIn=(name:string)=>FERMENTABLES.some(f=>same(f.name,name));
 const customFor=(name:string)=>customIngredients.some(c=>same(c.name,name));
 const sourceOf=(name:string)=>builtIn(name)?customFor(name)?"Edited":"Built-in":"Custom";
 const ingChecks:Problem[]=checkIngredient({unit:ing.unit,ppg:num(ing.ppg),sugar:num(ing.sugar),density:ing.density.trim()===""?undefined:num(ing.density)});
 const ingErrors:Problem[]=[
  ...(!ing.name.trim()?[{level:"error" as const,message:"Give the ingredient a name."}]:[]),
  ...(editingIng===null&&ingredients.some(i=>same(i.name,ing.name))?[{level:"error" as const,message:"An ingredient with that name already exists. Edit it from the list instead."}]:[]),
  ...(editingIng!==null&&!same(editingIng,ing.name)&&ingredients.some(i=>same(i.name,ing.name))?[{level:"error" as const,message:"Another ingredient already has that name."}]:[]),
  ...(ing.density.trim()!==""&&!(num(ing.density)>0)?[{level:"error" as const,message:"Density must be a number above 0 (water is 8.34 lb per gallon)."}]:[]),
 ];
 const ingProblems=[...ingErrors,...ingChecks],blocked=ingProblems.some(p=>p.level==="error"),ingTouched=editingIng!==null||[ing.name,ing.ppg,ing.sugar,ing.density,ing.note].some(v=>v.trim()!=="");
 const editIngredient=(p:IngredientPreset)=>{setMode("ingredients");setEditingIng(p.name);setIng({name:p.name,category:p.category,unit:unitForSystem(p.unit,system),ppg:String(p.ppg),sugar:String(p.sugar),density:p.density?String(p.density):"",note:p.note});reveal()};
 const resetIng=()=>{setEditingIng(null);setIng(emptyIng(system))};
 const saveIngredient=()=>{if(blocked)return;const density=ing.density.trim()===""?undefined:num(ing.density);const preset:IngredientPreset={name:ing.name.trim(),category:ing.category.trim()||"My ingredients",unit:ing.unit,ppg:num(ing.ppg),sugar:num(ing.sugar),note:ing.note.trim()||"Custom ingredient",...(density?{density}:{})};setCustomIngredients(x=>[preset,...x.filter(c=>!same(c.name,preset.name)&&!(editingIng&&same(c.name,editingIng)))]);resetIng()};
 const removeIngredient=(name:string)=>{setCustomIngredients(x=>x.filter(c=>!same(c.name,name)));if(editingIng&&same(editingIng,name))resetIng()};
 const q=query.trim().toLowerCase(),shown=ingredients.filter(i=>!q||i.name.toLowerCase().includes(q)||i.category.toLowerCase().includes(q)),groups=[...new Set(shown.map(i=>i.category))];
 const ingUnits=UNITS[system].includes(ing.unit)?UNITS[system]:[ing.unit,...UNITS[system]];

 // ---- yeasts
 const yeastBuiltIn=(name:string)=>has(YEASTS,name);
 const yeastSource=(name:string)=>yeastBuiltIn(name)?has(customYeasts,name)?"Edited":"Built-in":"Custom";
 const yProblems=():Problem[]=>{
  const out:Problem[]=[],name=yst.name.trim(),v={abvMin:num(yst.abvMin),abvMax:num(yst.abvMax),tempMin:num(yst.tempMin),tempMax:num(yst.tempMax),daysMin:num(yst.daysMin),daysMax:num(yst.daysMax)};
  if(!name)out.push({level:"error",message:"Give the yeast a name."});
  else if((editingYeast===null||editingYeast!==name)&&has(yeasts,name))out.push({level:"error",message:editingYeast===null?"A yeast with that name already exists. Edit it from the list instead.":"Another yeast already has that name."});
  if(Object.values(v).some(x=>!Number.isFinite(x)))out.push({level:"error",message:"Fill in the ABV tolerance, temperature and fermentation days."});
  else{
   if(v.abvMin<0||v.abvMax>25)out.push({level:"error",message:"ABV tolerance should be between 0% and 25%."});
   else if(v.abvMax>20)out.push({level:"warn",message:`${v.abvMax}% is very high. Double-check the tolerance on the packet.`});
   if(v.abvMin>v.abvMax)out.push({level:"error",message:"Minimum ABV tolerance is above the maximum."});
   if(v.tempMin>v.tempMax)out.push({level:"error",message:"Minimum temperature is above the maximum."});
   else if(v.tempMin<32||v.tempMax>110)out.push({level:"warn",message:"Fermentation temperatures are usually between 32 and 110 °F. Double-check these."});
   if(v.daysMin<1||v.daysMin>v.daysMax)out.push({level:"error",message:"Fermentation days need a minimum of at least 1 and a maximum at or above it."});
   else if(v.daysMax>90)out.push({level:"warn",message:"More than 90 days of active fermentation is unusual. Double-check."});
  }
  return out;
 };
 const yProbs=yProblems(),yBlocked=yProbs.some(p=>p.level==="error"),yTouched=editingYeast!==null||[yst.name,yst.abvMin,yst.abvMax,yst.tempMin,yst.tempMax,yst.daysMin,yst.daysMax,yst.uses,yst.profile,yst.note].some(v=>v.trim()!=="");
 const editYeast=(name:string)=>{const y=yeasts[name];setMode("yeasts");setEditingYeast(name);setYst({name,type:y.type,abvMin:String(y.abv[0]),abvMax:String(y.abv[1]),tempMin:String(y.temp[0]),tempMax:String(y.temp[1]),daysMin:String(y.days[0]),daysMax:String(y.days[1]),nutrient:y.nutrient,uses:y.uses,profile:y.profile,note:y.note});reveal()};
 const resetYeast=()=>{setEditingYeast(null);setYst(emptyYeast)};
 const saveYeast=()=>{if(yBlocked)return;const name=yst.name.trim(),profile:YeastProfile={type:yst.type.trim()||"Other",abv:[num(yst.abvMin),num(yst.abvMax)],temp:[num(yst.tempMin),num(yst.tempMax)],uses:yst.uses.trim()||"General use",profile:yst.profile.trim()||"Custom yeast",nutrient:yst.nutrient,note:yst.note.trim(),days:[num(yst.daysMin),num(yst.daysMax)]};setCustomYeasts(c=>{const next={...c};if(editingYeast&&editingYeast!==name)delete next[editingYeast];next[name]=profile;return next});resetYeast()};
 const removeYeast=(name:string)=>{setCustomYeasts(c=>{const next={...c};delete next[name];return next});if(editingYeast===name)resetYeast()};
 const set=<K extends keyof YeastForm>(k:K,v:string)=>setYst(x=>({...x,[k]:v}));
 const setI=<K extends keyof IngForm>(k:K,v:string)=>setIng(x=>({...x,[k]:v}));
 const byVolume=isVolumeUnit(ing.unit);

 return <section className="card full lib">
  <div className="cardhead"><div><em>LIBRARY</em><h2>Your ingredients and yeasts</h2></div><div className="lib-switch" role="tablist"><button role="tab" aria-selected={mode==="ingredients"} className={mode==="ingredients"?"on":""} onClick={()=>setMode("ingredients")}>Ingredients</button><button role="tab" aria-selected={mode==="yeasts"} className={mode==="yeasts"?"on":""} onClick={()=>setMode("yeasts")}>Yeasts</button></div></div>
  <p className="lib-intro">Add your own, or edit a built-in one. Edited built-ins keep an <b>Edited</b> tag and can be reset. Changes show up in the recipe pickers straight away and stay on this device.</p>
  {mode==="ingredients"?<div className="lib-grid">
   <div className="lib-list"><Input aria-label="Search ingredients" placeholder="Search ingredients" value={query} onChange={e=>setQuery(e.target.value)}/>
    {groups.map(g=><div key={g} className="lib-group"><h3>{g}</h3>{shown.filter(i=>i.category===g).map(i=><div className="lib-row" key={i.name}><div className="lib-name"><b>{i.name}</b><small>{i.note}</small></div><div className="lib-nums"><span><i>PPG</i>{i.ppg}</span><span><i>Sugar</i>{i.sugar}%</span><span><i>Unit</i>{unitForSystem(i.unit,system)}</span></div><div className="lib-actions"><em className={`tag ${sourceOf(i.name).toLowerCase()}`}>{sourceOf(i.name)}</em><button aria-label={`Edit ${i.name}`} title="Edit" onClick={()=>editIngredient(i)}><Pencil/></button>{customFor(i.name)&&<button aria-label={builtIn(i.name)?`Reset ${i.name} to default`:`Delete ${i.name}`} title={builtIn(i.name)?"Reset to default":"Delete"} onClick={()=>removeIngredient(i.name)}>{builtIn(i.name)?<RotateCcw/>:<Trash2/>}</button>}</div></div>)}</div>)}
    {!shown.length&&<p className="lib-empty">No ingredients match “{query}”.</p>}
   </div>
   <section className="lib-form" ref={formRef}><h3>{editingIng?`Edit ${editingIng}`:"Add an ingredient"}</h3>
    <div className="lib-fields">
     <Label label="Name"><Input value={ing.name} onChange={e=>setI("name",e.target.value)} placeholder="e.g. Agave Nectar"/></Label>
     <Label label="Category"><Input value={ing.category} list="lib-categories" onChange={e=>setI("category",e.target.value)}/><datalist id="lib-categories">{[...new Set(ingredients.map(i=>i.category))].map(c=><option key={c} value={c}/>)}</datalist></Label>
     <Label label="Default unit"><select value={ing.unit} onChange={e=>setI("unit",e.target.value)}>{ingUnits.map(u=><option key={u}>{u}</option>)}</select></Label>
     <Label label="PPG" hint={ing.unit==="each"?"Not used for items counted each":byVolume?"Gravity points from 1 gallon in 1 gallon":"Gravity points from 1 lb in 1 gallon"}><Input type="number" step=".1" value={ing.ppg} onChange={e=>setI("ppg",e.target.value)}/></Label>
     <Label label="Sugar %" hint="Fermentable sugar by weight"><Input type="number" step=".1" value={ing.sugar} onChange={e=>setI("sugar",e.target.value)}/></Label>
     <Label label="Density (lb/gal)" hint="Optional. Water is 8.34, honey about 11.9"><Input type="number" step=".1" value={ing.density} onChange={e=>setI("density",e.target.value)}/></Label>
     <Label label="Note"><Input value={ing.note} onChange={e=>setI("note",e.target.value)} placeholder="Flavor or usage note"/></Label>
    </div>
    <Problems items={ingTouched?ingProblems:[]} onUse={ppg=>setI("ppg",String(ppg))}/>
    <div className="lib-buttons"><Button disabled={blocked} onClick={saveIngredient}><Plus/>{editingIng?"Save changes":"Add ingredient"}{ingChecks.some(c=>c.level==="warn")&&!blocked?" anyway":""}</Button>{(editingIng||ing.name)&&<Button variant="outline" onClick={resetIng}>Cancel</Button>}</div>
   </section>
  </div>:<div className="lib-grid">
   <div className="lib-list">{Object.keys(yeasts).map(name=>{const y=yeasts[name];return <div className="lib-row yeast" key={name}><div className="lib-name"><b>{name}</b><small>{y.type} · {y.profile}</small></div><div className="lib-nums"><span><i>ABV</i>{y.abv[0]===y.abv[1]?`~${y.abv[1]}`:`${y.abv[0]}–${y.abv[1]}`}%</span><span><i>Temp</i>{y.temp[0]}–{y.temp[1]} °F</span><span><i>Days</i>{y.days[0]}–{y.days[1]}</span></div><div className="lib-actions"><em className={`tag ${yeastSource(name).toLowerCase()}`}>{yeastSource(name)}</em><button aria-label={`Edit ${name}`} title="Edit" onClick={()=>editYeast(name)}><Pencil/></button>{has(customYeasts,name)&&<button aria-label={yeastBuiltIn(name)?`Reset ${name} to default`:`Delete ${name}`} title={yeastBuiltIn(name)?"Reset to default":"Delete"} onClick={()=>removeYeast(name)}>{yeastBuiltIn(name)?<RotateCcw/>:<Trash2/>}</button>}</div></div>})}</div>
   <section className="lib-form" ref={formRef}><h3>{editingYeast?`Edit ${editingYeast}`:"Add a yeast"}</h3>
    <div className="lib-fields">
     <Label label="Name"><Input value={yst.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Lalvin ICV-D254"/></Label>
     <Label label="Type"><Input value={yst.type} list="lib-yeast-types" onChange={e=>set("type",e.target.value)}/><datalist id="lib-yeast-types">{YEAST_TYPES.map(t=><option key={t} value={t}/>)}</datalist></Label>
     <Label label="Nutrient need"><select value={yst.nutrient} onChange={e=>set("nutrient",e.target.value)}>{(NUTRIENT_LEVELS.includes(yst.nutrient)?NUTRIENT_LEVELS:[yst.nutrient,...NUTRIENT_LEVELS]).map(l=><option key={l}>{l}</option>)}</select></Label>
     <Label label="ABV tolerance, min %"><Input type="number" step=".5" value={yst.abvMin} onChange={e=>set("abvMin",e.target.value)}/></Label>
     <Label label="ABV tolerance, max %"><Input type="number" step=".5" value={yst.abvMax} onChange={e=>set("abvMax",e.target.value)}/></Label>
     <span className="lib-spacer"/>
     <Label label="Temperature, min °F"><Input type="number" value={yst.tempMin} onChange={e=>set("tempMin",e.target.value)}/></Label>
     <Label label="Temperature, max °F"><Input type="number" value={yst.tempMax} onChange={e=>set("tempMax",e.target.value)}/></Label>
     <span className="lib-spacer"/>
     <Label label="Active days, min"><Input type="number" value={yst.daysMin} onChange={e=>set("daysMin",e.target.value)}/></Label>
     <Label label="Active days, max"><Input type="number" value={yst.daysMax} onChange={e=>set("daysMax",e.target.value)}/></Label>
     <span className="lib-spacer"/>
     <Label label="Best for"><Input value={yst.uses} onChange={e=>set("uses",e.target.value)} placeholder="e.g. Traditional mead, white wine"/></Label>
     <Label label="Flavor profile"><Input value={yst.profile} onChange={e=>set("profile",e.target.value)} placeholder="e.g. Round mouthfeel"/></Label>
     <Label label="Note"><Input value={yst.note} onChange={e=>set("note",e.target.value)} placeholder="e.g. Keep cool"/></Label>
    </div>
    <Problems items={yTouched?yProbs:[]}/>
    <div className="lib-buttons"><Button disabled={yBlocked} onClick={saveYeast}><Plus/>{editingYeast?"Save changes":"Add yeast"}{yProbs.some(c=>c.level==="warn")&&!yBlocked?" anyway":""}</Button>{(editingYeast||yst.name)&&<Button variant="outline" onClick={resetYeast}>Cancel</Button>}</div>
   </section>
  </div>}
 </section>
}
