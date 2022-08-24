import React from "react";
import StatusTag from '@iso/components/utility/statusTag';
import HoldLevel from '@iso/enums/hold_level';
import MemoTypes from '@iso/enums/memo_types';

const JobAcceptanceLevel = ({ job }) => {
    if(job.acceptanceLevel && job?.memoType !== MemoTypes.DEAL){
        switch (job.acceptanceLevel) {
            case 1:
                return (
                    <StatusTag className="statusBadge" color={HoldLevel[1]}>
                        1st Hold
                    </StatusTag>
                );
            case 2:
                return (
                    <StatusTag className="statusBadge" color={HoldLevel[2]}>
                        2nd Hold
                    </StatusTag>
                );
            case 3:
                return (
                    <StatusTag className="statusBadge" color={HoldLevel[3]}>
                        3rd Hold
                    </StatusTag>
                );
            default:
                return null;
        }
    }

    return null;
};

export default JobAcceptanceLevel;