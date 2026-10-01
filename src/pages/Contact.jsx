import { useState, useRef, useEffect } from "react";

const empty = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const nameRef = useRef(null);
  useEffect(() => { nameRef.current?.focus(); }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.subject.trim()) e.subject = "Subject is required.";
    if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
    return e;
  };
  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setSuccess(false); };
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) { setSuccess(true); setForm(empty); }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-3">
      <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
      {success && <p className="text-green-600">Thanks! Your message was sent.</p>}
      <input ref={nameRef} name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" />
      {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
      <textarea name="message" rows="5" value={form.message} onChange={handleChange} placeholder="Message" />
      {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
      <button type="submit">Send</button>
    </form>
  );
}
