// src/components/leaderboard/mission-table.tsx
import React from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import Window from "@/views/home-v2/components/Window";

interface MissionData {
    mission: string;
    reward: string;
}

const MissionTable = () => {
    const data: MissionData[] = [
        { mission: "Participate in a game", reward: "1 points" },
        { mission: "Win a game", reward: "5 points" },
        { mission: "Refer a friend", reward: "10 points" },
    ];

    return (
        <Window title=" 🎯 MISSIONS 🎯">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold">Mission</TableHead>
                        <TableHead className="font-bold text-center">Reward</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.mission}</TableCell>
                            <TableCell className="text-center">{item.reward}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Window>
    );
};

export default MissionTable;
