import { Contact } from "@prisma/client";

export class Format {
  static identity(contacts: Contact[]) {
    //* Contacts are already sorted

    const emails: string[] = [];
    const phoneNumbers: string[] = [];
    const secondaryContactIds: number[] = [];

    contacts.map((contact, index) => {
      //* Removing duplicates
      if (contact.email && emails.indexOf(contact.email) === -1) {
        emails.push(contact.email);
      }
      if (
        contact.phoneNumber &&
        phoneNumbers.indexOf(contact.phoneNumber) === -1
      ) {
        phoneNumbers.push(contact.phoneNumber);
      }
      if (index > 0) secondaryContactIds.push(contact.id);
    });

    return {
      contact: {
        primaryContactId: contacts[0] ? contacts[0].id : null,
        emails,
        phoneNumbers,
        secondaryContactIds,
      },
    };
  }
}
