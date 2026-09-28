const StudentRepository = (() => {
  const STORAGE_KEY = "student_records_v1";
  const SEQ_KEY = "student_records_seq_v1";

  function _readAll() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  function _writeAll(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  function _nextId() {
    const year = new Date().getFullYear();
    let seq = parseInt(localStorage.getItem(SEQ_KEY) || "0", 10) + 1;
    localStorage.setItem(SEQ_KEY, String(seq));
    return `S-${year}-${String(seq).padStart(3, "0")}`;
  }

  function _seedIfEmpty() {
    if (_readAll() !== null) return;
    const seed = [
      { id: "22103894", name: "Kyle C. Tubod", program: "BS Information Technology", year: "4th Year", email: "22103894@usc.edu.ph", status: "Enrolled" },
      { id: "21104163", name: "Cyrus Enad", program: "BS Information Technology", year: "4th Year", email: "21104163@usc.edu.ph", status: "Enrolled" },
      { id: "22104361", name: "Adrian Ray Serrano", program: "BS Information Technology", year: "4th Year", email: "22104361@usc.edu.ph", status: "Enrolled" },
    ];
    localStorage.setItem(SEQ_KEY, "3");
    _writeAll(seed);
  }

  _seedIfEmpty();

  return {
    getAll() {
      return _readAll()
        .filter((r) => typeof r.id === "string" && r.id.length > 0)
        .sort((a, b) => a.id.localeCompare(b.id));
    },

    getById(id) {
      return _readAll().find((r) => r.id === id) || null;
    },

    add(record) {
      const records = _readAll();
      if (records.some((r) => r.id === record.id)) {
        throw new Error(`Student ID ${record.id} already exists.`);
      }
      const newRecord = { ...record };
      records.push(newRecord);
      _writeAll(records);
      return newRecord;
    },

    update(id, changes) {
      const records = _readAll();
      const idx = records.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      records[idx] = { ...records[idx], ...changes };
      _writeAll(records);
      return records[idx];
    },

    remove(id) {
      const records = _readAll();
      const next = records.filter((r) => r.id !== id);
      _writeAll(next);
      return next.length !== records.length;
    },

    search(term) {
      const t = term.trim().toLowerCase();
      if (!t) return this.getAll();
      return this.getAll().filter(
        (r) =>
          r.name.toLowerCase().includes(t) ||
          r.id.toLowerCase().includes(t) ||
          r.program.toLowerCase().includes(t)
      );
    },
  };
})();