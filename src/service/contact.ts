import { LinkPrecedence } from "@prisma/client";
import contactsRepository from "../repository/contacts-repository";
import { prismaWrapper } from "../utils/prisma";

export const getOrCreateIdentity = async (
  email?: string,
  phoneNumber?: string
) => {
  //* Get contacts by email and phone number
  const contacts = await contactsRepository.Read.byEmailOrPhoneNumber(
    email ? [email] : [],
    phoneNumber ? [phoneNumber] : []
  );

  //* If there is no contact then create one
  if (!contacts || contacts.length === 0) {
    const newContact = await contactsRepository.Create.newIdentity({
      email,
      phoneNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
      linkPrecedence: LinkPrecedence.primary,
    });

    return [newContact];
  } else {
    //* Check if there are multiple primary contacts
    const primaryContacts = contacts.filter(
      (contact) => contact.linkPrecedence === LinkPrecedence.primary
    );
    const secondaryContacts = contacts.filter(
      (contact) => contact.linkPrecedence === LinkPrecedence.secondary
    );

    const emails: string[] = [];
    const phoneNumbers: string[] = [];

    contacts.map((contact) => {
      if (contact.email) emails.push(contact.email);
      if (contact.phoneNumber) phoneNumbers.push(contact.phoneNumber);
    });

    if (primaryContacts && primaryContacts.length > 1) {
      //* Data is already sorted when we fetched it from the database
      const earliestPrimaryContact = primaryContacts[0];
      const primaryContactsToBeMarkedAsSecondary = primaryContacts.slice(1);

      if (
        primaryContactsToBeMarkedAsSecondary &&
        primaryContactsToBeMarkedAsSecondary.length > 0
      ) {
        //* Mark all other primary contacts as secondary and update the linkedId
        await prismaWrapper.prismaClient.contact.updateMany({
          where: {
            id: {
              in: primaryContactsToBeMarkedAsSecondary.map(
                (contact) => contact.id
              ),
            },
          },
          data: {
            linkedId: earliestPrimaryContact.id,
            linkPrecedence: LinkPrecedence.secondary,
          },
        });
      }
    }

    //* Edge case update all secondary contacts where linkedId is not the earliest primary contact id
    const secondaryContactsToBeUpdated = secondaryContacts.filter(
      (contact) =>
        primaryContacts &&
        primaryContacts[0] &&
        contact.linkedId !== primaryContacts[0].id
    );

    if (
      secondaryContactsToBeUpdated &&
      secondaryContactsToBeUpdated.length > 0
    ) {
      await prismaWrapper.prismaClient.contact.updateMany({
        where: {
          id: {
            in: secondaryContactsToBeUpdated.map((contact) => contact.id),
          },
        },
        data: {
          linkedId: primaryContacts[0].id,
        },
      });
    }

    return await contactsRepository.Read.byEmailOrPhoneNumber(
      emails,
      phoneNumbers
    );
  }
};
