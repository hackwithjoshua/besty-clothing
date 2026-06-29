'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success('Thanks for subscribing! Check your inbox.');
    setEmail('');
  }

  return (
    <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="form-input flex-1"
        required
      />
      <button type="submit" className="btn-primary whitespace-nowrap">
        Subscribe
      </button>
    </form>
  );
}
