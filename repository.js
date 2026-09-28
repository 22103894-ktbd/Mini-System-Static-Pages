const StudentRepository = (() =>{
  const BASE = "/api/students";

  async function getAll(){
    const res = await fetch(BASE);
    if(!res.ok) throw new Error("Failed to load students.");
    return res.json();
  }
  async function getById(id){
    const res = await fetch(`${BASE}/${encodeURIComponent(id)}`);
    if(res.status === 404) return null;
    if(!res.ok) throw new Error("Failed to load student.");
    return res.json();
  }
  async function add(record){
    const res = await fetch(BASE,{
      method: "POST",
      headers:{ "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || "Failed to add student.");
    return data;
  }
  async function update(id, changes){
    const res = await fetch(`${BASE}/${encodeURIComponent(id)}`,{
      method: "PUT",
      headers:{ "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update student.");
    return data;
  }
  async function remove(id){
    const res = await fetch(`${BASE}/${encodeURIComponent(id)}`,{ method: "DELETE" });
    if(!res.ok){
      const data = await res.json().catch(() =>({}));
      throw new Error(data.error || "Failed to delete student.");
    }
    return true;
  }
  async function search(term){
    const all = await getAll();
    const t = term.trim().toLowerCase();
    if(!t) return all;
    return all.filter(
      (r) =>
        r.name.toLowerCase().includes(t) ||
        r.id.toLowerCase().includes(t) ||
        r.program.toLowerCase().includes(t)
    );
  }
  return { getAll, getById, add, update, remove, search };
})();