import FirstShotIcon from "@assets/icons/FirstShotIcon.png";
import DeathmatchIcon from "@assets/icons/skull.png";
import AssassinIcon from "@assets/icons/assassin.png";
import ImposterIcon from "@assets/icons/suspect.png";
import ScavengerIcon from "@assets/icons/vulture.png";
import CaptureTheFlagIcon from "@assets/icons/flag.png";
import React from "react";

import {createGame} from "@components/api";


export default function createGameComponent () {
    return (
        <>
            <h1>Create Game</h1>
            <div className={"grid-container"}>
                <button onClick={() => handleCreateGame("FirstShot")} className="game-type-button">
                    <div className="button-content">
                        <img src={FirstShotIcon} alt="Create First Shot Game" width="100" height="100"/>
                        <span>First Shot</span>
                    </div>
                </button>
                <button className="disabled-game-type-button">
                    <div className="button-content">
                        <img src={DeathmatchIcon} alt="Create Deathmatch Game" width="100" height="100"/>
                        <span>Deathmatch</span>
                    </div>
                </button>
                <button className="disabled-game-type-button">
                    <div className="button-content">
                        <img src={AssassinIcon} alt="Create Assassin Game" width="100" height="100"/>
                        <span>Assassin</span>
                    </div>
                </button>
                <button className="disabled-game-type-button">
                    <div className="button-content">
                        <img src={ImposterIcon} alt="Create Imposter Game" width="100" height="100"/>
                        <span>Imposter</span>
                    </div>
                </button>
                <button className="disabled-game-type-button">
                    <div className="button-content">
                        <img src={ScavengerIcon} alt="Create Scavenger Game" width="100" height="100"/>
                        <span>Scavenger</span>
                    </div>
                </button>
                <button className="disabled-game-type-button">
                    <div className="button-content">
                        <img src={CaptureTheFlagIcon} alt="Create Capture the Flag Game" width="100"
                             height="100"/>
                        <span>Capture the Flag</span>
                    </div>
                </button>
            </div>
        </>
)
}