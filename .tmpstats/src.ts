import { subjects } from "../src/domain/catalog";
import { getQuestions } from "../src/data/index";
import { getPracticeQuestions } from "../src/data/practice";
const bySource = new Map<string, {n:number; ref:number; refs:Set<string>}>();
for (const s of subjects) for (const q of [...getQuestions(s.id), ...getPracticeQuestions(s.id)]) {
  const r = bySource.get(q.source) ?? {n:0, ref:0, refs:new Set()};
  r.n++; if (q.sourceRef) { r.ref++; r.refs.add(q.sourceRef); }
  bySource.set(q.source, r);
}
for (const [k,v] of bySource) console.log(k, "題數", v.n, "有 sourceRef", v.ref, "相異值", v.refs.size, [...v.refs].slice(0,4));
