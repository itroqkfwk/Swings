import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/Card.jsx";
import { Badge } from "./ui/Badge.jsx";
import {getParticipantsByGroupId, joinMatch} from "../api/matchParticipantApi.js";
import JoinConfirmModal from "./JoinConfirmModal.jsx";
import GroupButton from "./ui/GroupButton.jsx";
import {getCurrentUser} from "../api/matchGroupApi.js";

export default function MatchGroupCard({ group }) {
    const navigate = useNavigate();
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [participants, setParticipants] = useState([]);

    const isFull = group.currentParticipants >= group.maxParticipants;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    useEffect(() => {
        if (showJoinModal && group?.matchGroupId) {
            getParticipantsByGroupId(group.matchGroupId).then((data) => {
                const approved = data.filter((p) => p.participantStatus === "ACCEPTED");
                setParticipants(approved);
            });
        }
    }, [showJoinModal, group?.matchGroupId]);

    return (
        <>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <Badge variant={group.matchType === "screen" ? "info" : "success"} className="mb-2">
                            {group.matchType === "screen" ? "스크린" : "필드"}
                        </Badge>
                        <Badge variant={isFull ? "warning" : "success"}>
                            {isFull ? "모집 완료" : "모집 중"}
                        </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold">{group.groupName}</CardTitle>
                    <CardDescription className="line-clamp-2">{group.description}</CardDescription>
                </CardHeader>

                <CardContent className="pb-2">
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <MapPinIcon className="h-4 w-4 text-golf-green-600" />
                            <span>{group.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-golf-green-600" />
                            <span>{formatDate(group.schedule)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <UsersIcon className="h-4 w-4 text-golf-green-600" />
                            <span>{group.currentParticipants}/{group.maxParticipants}명</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-golf-green-700">방장:</span>
                            <span>{group.hostUsername}</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter>
                    <GroupButton
                        onClick={() => setShowJoinModal(true)}
                        disabled={isFull}
                        variant={isFull ? "outline" : "default"}
                        className="w-full"
                    >
                        {isFull ? "모집 완료" : "그룹 상세 보기"}
                    </GroupButton>
                </CardFooter>
            </Card>

            <JoinConfirmModal
                isOpen={showJoinModal}
                onClose={() => setShowJoinModal(false)}
                group={group}
                participants={participants}
                onConfirm={async () => {
                    try {
                        const currentUser = await getCurrentUser(); // 현재 사용자 정보 받아오기
                        await joinMatch(group.matchGroupId, currentUser.userId); // 참가 신청
                        alert("참가 신청 완료!");
                        navigate(`/matchgroup/${group.matchGroupId}`);
                    } catch (error) {
                        console.error("신청 중 오류:", error);
                        alert("신청에 실패했습니다.");
                    }
                }}
            />
        </>
    );
}
