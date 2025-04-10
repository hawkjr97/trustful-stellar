import {
    CheckIcon,
    ContentTabs,
    PlusIcon,
    PrimaryButton,
    StarIcon,
    TagIcon,
    UserIcon,
} from '@/components';
import { SearchIcon } from '@/components/atoms/icons/SearchIcon';
import { TableEmptyScreen } from '@/components/atoms/TableEmptyScreen';
import { CustomTable } from '@/components/organisms/CustomTable';
import { IconPosition } from '@/types/iconPosition';
import { useRouter } from 'next/router';
import tailwindConfig from 'tailwind.config';
import { TrashIcon } from '@/components/atoms/icons/TrashIcon';
import { useModal } from '@/hooks/useModal';
import { CustomModal } from './components/molecules/custom-modal';
import LeaderboardTable from '../../components/molecules/leaderboard-table';
import { useEffect, useState } from 'react';
import { CommunityTableCell } from '../../components/molecules/CommunityTableCell';
import { useCommunityContext } from '@/components/community/Context';
('./components/molecules/leaderboard-table');
import { useAuthContext } from '@/components/auth/Context';
import useCommunitiesController from '@/components/community/hooks/controller';
import toast from "react-hot-toast";
import { addUser, mainTestnet } from "@/testCall";
import { kit } from "@/components/auth/ConnectStellarWallet";
import { ALBEDO_ID } from "@creit.tech/stellar-wallets-kit";
import { checkIfWalletIsInitialized } from "@/lib/stellar/isFundedStellarWallet";


interface DetailsProps {
    params: {
        data: string[];
    };
}

export default function DetailsCommunity({ params }: DetailsProps) {
    const { openModal, closeModal, isOpen } = useModal();
    const { userAddress, setUserAddress } = useAuthContext();
    const { stellarContractJoinCommunities, stellarContractManagers } = useCommunitiesController()
    const router = useRouter();
    const { status, communityAddress } = router.query;
    const [newManager, setNewManager] = useState('')
    const [removeManager, setRemoveManager] = useState('')


    const {
        getCommunitiesBadgesList,
        getCommunitiesMembersList,
        communitiesBadgesList,
        communitiesMembersList,
        getCommunitiesDetails,
        communitiesDetail,
        isJoined
    } = useCommunityContext();



    useEffect(() => {
        if (communityAddress) {
            getCommunitiesDetails(`${communityAddress}`);
            getCommunitiesBadgesList(`${communityAddress}`);
            getCommunitiesMembersList(`${communityAddress}`);
        }
    }, [communityAddress]); //eslint-disable-line react-hooks/exhaustive-deps

    const totalBadgesMemberList = communitiesDetail?.total_badges

    const statusList = {
        all: 'all',
        joined: 'joined',
        created: 'created',
        hidden: 'hidden',
    };

    const { all, joined, created, hidden } = statusList;

    if (!communityAddress || !status) {
        return <h1>Carregando...</h1>;
    }


    const handleJoin = async () => {
        try {
            kit.signTransaction(ALBEDO_ID);
            const { address } = await kit.getAddress();
            await checkIfWalletIsInitialized(address);
            setUserAddress(address);

            console.log("\nAdding user to contract...");
            const response = await addUser("teste");
            console.log("Transaction response:", response);

            if (response.success) {
                console.log("User added successfully!");
                console.log("Transaction ID:", response.transactionId);
            } else {
                console.error("Failed to add user:", response.error);
                console.error("Error details:", response.errorDetails);
            }
        } catch (error) {
            toast.error(
                "Can't find your wallet registry, make sure you're trying to connect an initialized(funded) wallet"
            );
            setUserAddress("");
        }
    };

    const handleJoinedCommunities = async () => {
        const result = await stellarContractJoinCommunities.addUser();

        if (result.success) {
            console.log('Transaction successful:', result.txHash);
        } else {
            console.error('Transaction failed:', result.error);
        }
    };

    const handleExitCommunities = async () => {
        const result = await stellarContractJoinCommunities.removeUser();

        if (result.success) {
            console.log('Transaction successful:', result.txHash);
        } else {
            console.error('Transaction failed:', result.error);
        }
    };

    const handleInviteManager = async (newManager: string) => {
        const sender = 'GCPZPQYGG3QBIRA5ZIKLD3WQWFGESFA453TUXHRMP7NZYTTERIK2CXGE'; //TO-DO Comparar user logado com os managers que estao vindo do details

        const result = await stellarContractManagers.addManager(sender, newManager);

        if (result.success) {
            console.log('Transaction successful:', result.txHash);
        } else {
            console.error('Transaction failed:', result.error);
        }
    };

    const handleRemoveManager = async (newManager: string) => {
        const sender = 'GCPZPQYGG3QBIRA5ZIKLD3WQWFGESFA453TUXHRMP7NZYTTERIK2CXGE'; //TO-DO Comparar user logado com os managers que estao vindo do details

        const result = await stellarContractManagers.removeManager(sender, newManager);

        if (result.success) {
            console.log('Transaction successful:', result.txHash);
        } else {
            console.error('Transaction failed:', result.error);
        }
    };

    const newCommunitiesBadgesList = Array.isArray(communitiesBadgesList?.community_badges)
        ? communitiesBadgesList.community_badges
        : [];


    const searchedUserBadges = newCommunitiesBadgesList.map((badge: any) => ({
        badgeName: (
            <div className="flex flex-row items-center h-7">
                <div className="flex flex-col">
                    <span>{badge?.name}</span>
                    <span>{badge?.score}</span>
                    <span className="text-sm text-whiteOpacity05">
                        Points: {badge.score}
                    </span>
                </div>
            </div>
        ),
        Score: <CommunityTableCell issuerAddress={badge?.score.toString()} />,
        Name: <CommunityTableCell issuerAddress={badge?.name} />,
        Status: <CommunityTableCell issuerAddress={badge?.user_has ? 'Completed' : 'Pending'} />,
    }));

    return (
        <div className="flex flex-col w-full h-[calc(100vh-74px)] bg-brandBlack">
            <div className="flex justify-between p-8">
                <div>
                    <h1 className="text-2xl">{`${communitiesDetail?.name}`}</h1>
                    <h3 className="text-gray-500">
                        {`${communitiesDetail?.description}`}
                    </h3>
                </div>

                <div>
                    {status === all && (
                        <div className="flex justify-items-center py-2">
                            {isJoined ? (
                                <PrimaryButton
                                    className=" rounded-lg w-max text-brandGreen bg-darkGreenOpacity01"
                                    label="Joined"
                                    icon={
                                        <PlusIcon
                                            color={tailwindConfig.theme.extend.colors.brandGreen}
                                            width={16}
                                            height={16}
                                        />
                                    }
                                    iconPosition={IconPosition.LEFT}
                                    onClick={handleExitCommunities}
                                />
                            )
                                :
                                (
                                    <PrimaryButton
                                        className="rounded-lg w-max"
                                        label='Join'
                                        icon={<PlusIcon color="black" width={16} height={16} />}
                                        iconPosition={IconPosition.LEFT}
                                        onClick={handleJoin}
                                    />
                                )

                            }

                        </div>
                    )}
                    {status === created && (
                        <div className="flex justify-items-center py-2 gap-2">
                            <div>
                                <PrimaryButton
                                    className=" rounded-lg w-max text-brandGreen bg-darkGreenOpacity01"
                                    label="Hide"
                                    icon={
                                        <PlusIcon
                                            color={tailwindConfig.theme.extend.colors.brandGreen}
                                            width={16}
                                            height={16}
                                        />
                                    }
                                    iconPosition={IconPosition.LEFT}
                                    onClick={() => openModal('hideCommunity')}
                                />
                            </div>
                            <div>
                                <PrimaryButton
                                    className="rounded-lg w-max"
                                    label="Managers"
                                    icon={<PlusIcon color="black" width={16} height={16} />}
                                    iconPosition={IconPosition.LEFT}
                                    onClick={() => openModal('managers')}
                                />
                            </div>
                        </div>
                    )}
                    {status === joined && (
                        <div className="flex justify-items-center py-2">
                            <PrimaryButton
                                className=" rounded-lg w-max text-brandGreen bg-darkGreenOpacity01"
                                label="Joined"
                                icon={
                                    <CheckIcon
                                        color={tailwindConfig.theme.extend.colors.brandGreen}
                                        width={16}
                                        height={16}
                                    />
                                }
                                iconPosition={IconPosition.LEFT}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex px-8 gap-2 items-center">
                <div>
                    <UserIcon className="w-4" />
                </div>
                <div className="text-gray-500">
                    Created by {communitiesDetail?.creator_address?.substring(0, 10)}...
                </div>
                <div className="text-gray-500">/</div>

                <div>
                    <UserIcon className="w-4" />
                </div>
                <div className="text-gray-500">{communitiesDetail?.total_members}</div>
                <div className="text-gray-500">partcipants</div>
                <div className="text-gray-500">/</div>

                <div>
                    <TagIcon className="w-4" />
                </div>
                <div className="text-gray-500">{communitiesDetail?.total_badges}</div>
                <div className="text-gray-500">Badges</div>
            </div>

            <CustomModal
                title="Hide community?"
                isOpen={isOpen('hideCommunity')}
                onClose={() => closeModal('hideCommunity')}
                isAsync={false}
                headerBackgroundColor="bg-whiteOpacity008"
            >
                <>
                    <div className="w-full bg-whiteOpacity008">
                        <div className="p-6 border-whiteOpacity005 border-b">
                            <span className="text-base font-normal">
                                {`If you hide this community it won't be visible anymore.`}
                            </span>
                        </div>
                    </div>
                    <div className="bg-whiteOpacity008 pt-4 pr-6 pb-4 pl-6 w-[480px] h-[68px] flex justify-end gap-2">
                        <button className="text-sm text-center w-[153px] h-[36px] rounded-md bg-darkGreenOpacity01 text-brandGreen pr-2 pl-2">
                            No, keep visible
                        </button>
                        <button className="text-sm text-center w-[102px] h-[36px] rounded-md bg-othersRed text-brandBlack pr-2 pl-2">
                            Yes, hide
                        </button>
                    </div>
                </>
            </CustomModal>

            <CustomModal
                title="People that can manage"
                isOpen={isOpen('managers')}
                onClose={() => closeModal('managers')}
                isAsync={false}
                headerBackgroundColor="bg-whiteOpacity008"
            >
                <>
                    <div className="bg-whiteOpacity008 flex items-center flex-col w-[580px] h-[428px]">
                        <div className="flex flex-col items-center w-[552px] h-[172px]">
                            <div className="w-[552px]">
                                <div className="flex gap-3 py-3">
                                    <input
                                        placeholder="Add managers by inserting the Stellar address"
                                        className="w-[440px] h-[36px] p-2 rounded-lg bg-whiteOpacity005"
                                        type="text"
                                        onChange={(e) => setNewManager(e.target.value)}
                                    />
                                    <button className="flex items-center justify-center w-[100px] h-[36px] rounded-lg bg-brandGreen text-base text-brandBlack text-center"
                                        onClick={() => handleInviteManager(newManager)}>
                                        Invite
                                    </button>
                                </div>
                                <div className="w-full flex flex-col">
                                    {communitiesDetail?.managers?.map((item) => (
                                        <div key={item} className="w-full flex items-center border-b border-whiteOpacity005 border-opacity-10 py-3">
                                            <div className="w-full flex justify-between items-center gap-2">
                                                <div className="flex gap-4 items-center">
                                                    <div className="w-[35px] h-[35px] rounded-full p-2 bg-blue-500">
                                                        <StarIcon />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-normal">
                                                            {`${item.slice(0, 32)}...`}
                                                        </span>
                                                        <span className="text-xs text-whiteOpacity05">
                                                            Manager
                                                        </span>
                                                    </div>
                                                </div>
                                                <div
                                                    onClick={() => { openModal('deleteBadge'); () => setRemoveManager(item) }}
                                                    className="w-[15px] h-[15px] cursor-pointer"
                                                >
                                                    <TrashIcon />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            </CustomModal>

            <CustomModal
                title="Delete badge?"
                isOpen={isOpen('deleteBadge')}
                onClose={() => closeModal('deleteBadge')}
                // onButtonClick={}
                isAsync={false}
                headerBackgroundColor="bg-whiteOpacity008"
            >
                <>
                    <div className="bg-whiteOpacity008 w-[500px] h-[100px] p-6">
                        <span className="text-base font-normal">
                            If you delete this badge, it will no longer be valid as a score
                            for your community and may impact the reputation scores of your
                            community members.
                        </span>
                    </div>
                    <div className="bg-whiteOpacity008 pt-4 pr-6 pb-4 pl-6 flex justify-end gap-2">
                        <button className="text-sm text-center w-[153px] h-[36px] rounded-md bg-darkGreenOpacity01 text-brandGreen  ">
                            No, keep it
                        </button>
                        <button onClick={() => alert()} className="text-sm text-center w-[102px] h-[36px] rounded-md bg-othersRed text-brandBlack ">
                            Yes, delete
                        </button>
                    </div>
                </>
            </CustomModal>

            <div className="py-8">
                {status === all && (
                    <ContentTabs
                        tabs={{
                            Badges: {
                                content: (
                                    <div className="px-12">
                                        <CustomTable
                                            childrenForEmptyTable={
                                                <TableEmptyScreen
                                                    icon={
                                                        <SearchIcon
                                                            color={
                                                                tailwindConfig.theme.extend.colors
                                                                    .whiteOpacity05
                                                            }
                                                        />
                                                    }
                                                    title="Search to start"
                                                    description="Check a user's reputation by searching for their address"
                                                />
                                            }
                                            className="mt-6"
                                            headers={['Name', 'Score']}
                                            data={searchedUserBadges}
                                        ></CustomTable>
                                    </div>
                                ),
                                tabNumber: 1,
                            },
                            Leaderboard: {
                                content: (
                                    <LeaderboardTable
                                        communitiesMembersList={communitiesMembersList}
                                        totalBadgesMemberList={totalBadgesMemberList}
                                    />
                                ),
                                tabNumber: 2,
                            },
                        }}
                    ></ContentTabs>
                )}
                {status === created && (
                    <ContentTabs
                        tabs={{
                            Badges: {
                                content: (
                                    <div className="px-12">
                                        <CustomTable
                                            childrenForEmptyTable={
                                                <TableEmptyScreen
                                                    icon={
                                                        <SearchIcon
                                                            color={
                                                                tailwindConfig.theme.extend.colors
                                                                    .whiteOpacity05
                                                            }
                                                        />
                                                    }
                                                    title="Search to start"
                                                    description="Check a user's reputation by searching for their address"
                                                />
                                            }
                                            className="mt-6"
                                            headers={['Name', 'Score', 'Status']}
                                            data={searchedUserBadges}
                                        ></CustomTable>
                                    </div>
                                ),
                                tabNumber: 1,
                            },
                            Leaderboard: {
                                content: (
                                    <LeaderboardTable
                                        communitiesMembersList={communitiesMembersList}
                                    />
                                ),
                                tabNumber: 2,
                            },
                        }}
                    ></ContentTabs>
                )}
                {status === joined && (
                    <ContentTabs
                        tabs={{
                            Badges: {
                                content: (
                                    <div className="px-12">
                                        <CustomTable
                                            childrenForEmptyTable={
                                                <TableEmptyScreen
                                                    icon={
                                                        <SearchIcon
                                                            color={
                                                                tailwindConfig.theme.extend.colors
                                                                    .whiteOpacity05
                                                            }
                                                        />
                                                    }
                                                    title="Search to start"
                                                    description="Check a user's reputation by searching for their address"
                                                />
                                            }
                                            className="mt-6"
                                            headers={['Name', 'Score', 'Status']}
                                            data={searchedUserBadges}
                                        ></CustomTable>
                                    </div>
                                ),
                                tabNumber: 1,
                            },
                            Leaderboard: {
                                content: (
                                    <LeaderboardTable
                                        communitiesMembersList={communitiesMembersList}
                                        totalBadgesMemberList={totalBadgesMemberList}
                                    />
                                ),
                                tabNumber: 2,
                            },
                        }}
                    ></ContentTabs>
                )}
            </div>
        </div>
    );
}
