import { Prisma } from "@prisma/client";
import { prismaWrapper } from "../utils/prisma";

class Read {
  static async byEmailOrPhoneNumber(
    emails?: string[],
    phoneNumbers?: string[]
  ) {
    const { prismaClient } = prismaWrapper;
    const contacts = await prismaClient.contact.findMany({
      where: {
        OR: [
          {
            email: {
              in: emails,
            },
          },
          {
            phoneNumber: {
              in: phoneNumbers,
            },
          },
        ],
      },
      orderBy: [
        {
          createdAt: "asc",
        },
      ],
    });

    return contacts;
  }

  static async byEmailAndPhoneNumber(email?: string, phoneNumber?: string) {
    return await prismaWrapper.prismaClient.contact.findFirst({
      where: {
        email,
        phoneNumber,
      },
    });
  }
}

class Create {
  static async newIdentity(contact: Prisma.ContactCreateInput) {
    return await prismaWrapper.prismaClient.contact.create({
      data: {
        ...contact,
      },
    });
  }
}

export default {
  Read,
  Create,
};
