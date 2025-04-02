export interface Communities {
    community_address: string;
    factory_address: string;
    name: string;
    description: string;
    creator_address: string;
    is_hidden: boolean;
    blocktimestamp: string;
    total_badges: number;
    total_members: number;
    managers: string[];
    is_joined: boolean;
}

// export interface Communities {
//     communityAddress: string;
//     factoryAddress?: string;
//     name: string;
//     description: string;
//     creatorAddress?: string;
//     isHidden?: boolean;
//     blocktimestamp?: string;
//     totalBadges?: number;
//     totalMembers?: number;
//     managers?: string[];
//     id: string;
// }