// src/components/leaderboard/leaderboard-table.tsx
import React, { useState } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { formatEthereumAddress } from "@/utils/string";
import Image from "next/image";

interface LeaderboardData {
    rank: number;
    address: string;
    total_deposit: number;
}

interface LeaderboardTableProps {
    data: LeaderboardData[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data }) => {

    const getRowClassName = (rank: number) => {
        switch (rank) {
            case 1:
                return "bg-yellow-400";
            case 2:
                return "bg-blue-400";
            case 3:
                return "bg-purple-400";
            default:
                return "";
        }
    };

    return (
        <div className="relative overflow-x-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold">Rank</TableHead>
                        <TableHead className="font-bold">Address</TableHead>
                        <TableHead className="font-bold text-center">Total Deposit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="overflow-hidden">
                    {data.map((item, index) => (
                        <TableRow
                            key={index}
                            className={`${getRowClassName(item.rank)} transition-all duration-200 hover:opacity-50`}
                        >
                            <TableCell className="flex items-center ">
                                {item.rank <= 3 && (
                                    <Image
                                        src="/images/star.svg"
                                        alt="star"
                                        width={20}
                                        height={20}
                                        className="mr-2"
                                    />
                                )}
                                {item.rank}
                            </TableCell>
                            <TableCell className="">{formatEthereumAddress(item.address)}</TableCell>
                            <TableCell className="text-center">{item.total_deposit}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default LeaderboardTable;