import { PrismaClient, User } from '@prisma/client';
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
    const usersByIds = ids.map((id) => users.find((user) => user.id === id));
    return usersByIds;
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

export const userSubscribedToDL = (prisma: PrismaClient) => {
  const dl = new DataLoader(async (ids: Readonly<string[]>) => {
    const userSubscriptions = await prisma.subscribersOnAuthors.findMany({
      where: {
        subscriberId: { in: ids as string[] },
      },
      include: { author: true },
    });

    const userSubscriptionsById = ids.map((id) =>
      userSubscriptions
        .filter((subscription) => subscription.subscriberId === id)
        .map((subscription) => subscription.author),
    );

    return userSubscriptionsById;
  });

  return dl;
};

export const subscribedToUserDL = (clientDb: PrismaClient) => {
  const dl = new DataLoader(async (ids: Readonly<string[]>) => {
    const followers = await clientDb.subscribersOnAuthors.findMany({
      where: {
        authorId: { in: ids as string[] },
      },
      include: { subscriber: true },
    });

    const followersById = ids.map(
      (id) =>
        followers
          .filter((follower) => follower.authorId === id)
          .map((follower) => follower.subscriber) || [],
    );

    return followersById;
  });

  return dl;
};

export const getDataLoaders = (prisma: PrismaClient) => {
  return {
    memberTypeDL: memberTypeDL(prisma),
    userDL: userDL(prisma),
    postDL: postDL(prisma),
    profileDL: profileDL(prisma),
    userSubscribedToDL: userSubscribedToDL(prisma),
    subscribedToUserDL: subscribedToUserDL(prisma),
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
    userSubscribedToDL: DataLoaderType<User>;
    subscribedToUserDL: DataLoaderType<User>;
  };
};
