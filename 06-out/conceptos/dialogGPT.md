
Here’s a breakdown of what’s known about DialoGPT: its history, key people, what it achieved, and what’s not known (including cost).

---

What is DialoGPT
- Full paper: “DialoGPT: Large-Scale Generative Pre-training for Conversational Response Generation”  ￼
- Released by Microsoft Research in November 2019.  ￼
- Trained on 147 million conversation-like exchanges extracted from Reddit comment chains (2005–2017).  ￼

---

Researchers & Teams
- Authors: Yizhe Zhang, Siqi Sun, Michel Galley, Yen-Chun Chen, Chris Brockett, Xiang Gao, Jianfeng Gao, Jingjing Liu, Bill Dolan.  ￼
- Project under Microsoft Research / Dynamics 365 AI Research.  ￼

---

Concepts / Technical Advances
- Built from / extends GPT-2 style architecture (Transformer-based).  ￼
- Fine-tuned specifically for conversational response generation, aiming for single-turn dialogue with coherence and relevance.  ￼
- Evaluated via both automatic metrics and human evaluation. It was shown to perform “more relevant, contentful and context‐consistent responses than baseline systems” in those single-turn settings.  ￼

---

What it does not (or limits)
- It is not fine-tuned for long, coherent multi-turn dialogue with memory. The context window is limited.
- It can be repetitive, or produce generic responses.
- It does not guarantee factual correctness or large domain knowledge beyond its training.

---

Unknown / Less Clear Data
- Cost of training: Microsoft did not publicly disclose the financial cost (compute hours, infrastructure, etc.).
- Funding specifics: It’s internal to Microsoft; presumably funded by Microsoft’s research budget. No grant numbers or budget figures are published (at least not in public domain as of last check).

---

Summary Table

Aspect	Known
Year released	Nov 2019  ￼
Training data size / source	147M Reddit exchanges (2005-2017)  ￼
Researchers	Y. Zhang; S. Sun; M. Galley; Y-C. Chen; C. Brockett; X. Gao; J. Gao; J. Liu; B. Dolan  ￼
Main technical advance	Pretraining + fine-tuning for conversational responses; Transformer architecture; large‐scale Reddit data  ￼
Cost / Budget	Not disclosed publicly
Financing / sponsor	Microsoft Research / Dynamics 365 AI Research  ￼
New technologies leveraged	Transformer architecture, large corpus, large-scale self-supervised pretraining extended to dialogue domain.


---

If you like, I can try to dig through Microsoft’s internal reports / filings / blogs to find estimate numbers (compute used, cost in dollars) — sometimes those are leaked or approximated. Do you want me to try that?