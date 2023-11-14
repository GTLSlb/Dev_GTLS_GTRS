import React from "react";
import ReactPlayer from "react-player";
import styled from "styled-components";
import Gtls from "../../../assets/videos/Gtls-aus.mp4"

const Player = ({ className }) => (
    <ReactPlayer
        url={Gtls}
        className={className}
        width="100%"
        height="100%"
        controls={true}
    />
);

const AbsolutelyPositionedPlayer = styled(Player)`
    position: absolute;
    top: 0;
    left: 0;
`;

const RelativePositionWrapper = styled.div`
    position: relative;
    padding-top: 56.25%;
`;

const ResponsiveStyledPlayer = () => (
    <RelativePositionWrapper>
        <AbsolutelyPositionedPlayer />
    </RelativePositionWrapper>
);

export default ResponsiveStyledPlayer;
