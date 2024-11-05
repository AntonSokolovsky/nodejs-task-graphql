import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { IMember } from './types/member.js';
import { IUser } from './types/user.js';
import { IPost } from './types/post.js';
import { IProfile } from './types/profile.js';

export const memberTypeDL = (prisma: PrismaClient) => {
  const dl = new DataLoader(async (ids: Readonly<string[]>) => {
    const memberTypes: IMember[] = await prisma.memberType.findMany({
      where: { id: { in: ids as string[] } },
    });
    const memberTypeById = ids.map((id) =>
      memberTypes.find((memberType) => memberType.id === id),
    );
    return memberTypeById;
  });
  return dl;
};

export const userDL = (prisma: PrismaClient) => {
  const dl = new DataLoader(async (ids: Readonly<string[]>) => {
    const users: IUser[] = await prisma.user.findMany({
      where: { id: { in: ids as string[] } },
      include: { userSubscribedTo: true, subscribedToUser: true },
    });
    const userById = ids.map((id) => users.find((user) => user.id === id));
    return userById;
  });
  return dl;
};

export const postDL = (prisma: PrismaClient) => {
  const dl = new DataLoader(async (ids: Readonly<string[]>) => {
    const posts: IPost[] = await prisma.post.findMany({
      where: { authorId: { in: ids as string[] } },
    });
    const postById = ids.map((id) => posts.filter((post) => post.authorId === id));
    return postById;
  });
  return dl;
};

export const profileDL = (prisma: PrismaClient) => {
  const dl = new DataLoader(async (ids: Readonly<string[]>) => {
    const profiles: IProfile[] = await prisma.profile.findMany({
      where: { userId: { in: ids as string[] } },
    });
    const profileById = ids.map((id) =>
      profiles.find((profile) => profile.userId === id),
    );
    return profileById;
  });
  return dl;
};

export const getDataLoaders = (prisma: PrismaClient) => {
  return {
    memberTypeDL: memberTypeDL(prisma),
    userDL: userDL(prisma),
    postDL: postDL(prisma),
    profileDL: profileDL(prisma),
  };
};

export type DataLoaderType<T> = DataLoader<string, T | undefined, string>;

export type ContextType = {
  prisma: PrismaClient;
  dataLoaders: {
    memberTypeDL: DataLoaderType<IMember>;
    userDL: DataLoaderType<IUser>;
    postDL: DataLoaderType<IPost>;
    profileDL: DataLoaderType<IProfile>;
  };
};
