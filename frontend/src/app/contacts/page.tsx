import { Search } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { contacts } from "@/lib/app-data";

export default function ContactsPage() {
  return (
    <AppShell
      title="Contacts"
      description="A lightweight customer record before you build a full CRM."
      action={<button className="app-action">Import CSV</button>}
    >
      <section className="app-panel table-panel">
        <div className="panel-heading">
          <h2>Customer Signals</h2>
          <Search size={18} />
        </div>
        <div className="data-table">
          {contacts.map((contact) => (
            <div className="data-row" key={contact.name}>
              <strong>{contact.name}</strong>
              <span>{contact.channel}</span>
              <span>{contact.value}</span>
              <em>{contact.tag}</em>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
