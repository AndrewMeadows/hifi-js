//
//  scriptedAgent.js
//  
//
//  Created by Stephen Birarda on 05/08/15.
//  Modified by Chris Collins and Andrew Meadows.
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
//  This script is made for load testing HF servers. It connects to the HF servers and sends/receives data.
//  Run this on an assignment-client.
//


var sound_filenames = ["AB1.wav", "Anchorman2.wav", "B1.wav", "B1.wav", "Bale1.wav", "Bandcamp.wav",
    "Big1.wav", "Big2.wav", "Brian1.wav", "Buster1.wav", "CES1.wav", "CES2.wav", "CES3.wav", "CES4.wav", 
    "Carrie1.wav", "Carrie3.wav", "Charlotte1.wav", "EN1.wav", "EN2.wav", "EN3.wav", "Eugene1.wav", "Francesco1.wav",
    "Italian1.wav", "Japanese1.wav", "Leigh1.wav", "Lucille1.wav", "Lucille2.wav", "MeanGirls.wav", "Murray2.wav",
    "Nigel1.wav", "PennyLane.wav", "Pitt1.wav", "Ricardo.wav", "SN.wav", "Sake1.wav", "Samantha1.wav", "Samantha2.wav", 
    "Spicoli1.wav", "Supernatural.wav", "Swearengen1.wav", "TheDude.wav", "Tony.wav", "Triumph1.wav", "Uma1.wav",
    "Walken1.wav", "Walken2.wav", "Z1.wav", "Z2.wav"
    ];

var nameArray = [
    "http://mpassets.highfidelity.com/bd80a6d7-7173-489e-87c6-f7ee56e65530-v1/M_RetFut.fst",
    "http://mpassets.highfidelity.com/47c8d706-d486-4c2d-afcc-70d4e1e25117-v1/M_RetSpaSuit.fst",
    "http://mpassets.highfidelity.com/548d0792-0bac-4933-bbfc-57d71912d77e-v1/M_OutMer.fst",
    "http://mpassets.highfidelity.com/13277c09-892f-4a5e-b9a5-8994a37d68bf-v1/F_WasWar.fst",
    "http://mpassets.highfidelity.com/2d384111-0f0e-42e2-b800-66bfcab4aefb-v1/F_VooQue.fst",
    "http://mpassets.highfidelity.com/57e4d1cd-9f52-4c95-9051-326f9bb114ea-v1/F_SteAvi.fst",
    "http://mpassets.highfidelity.com/da2ad4cd-47d4-41da-b764-41f39ff77e30-v1/F_JerGir.fst",
    "http://mpassets.highfidelity.com/96c747ab-f71b-44ee-8eb9-d19fc9593dda-v1/F_CatBur.fst",
    "http://mpassets.highfidelity.com/ede82c38-c66e-4f67-9e0b-0bb0782db18f-v1/M_WesOut.fst",
    "http://mpassets.highfidelity.com/8872ae86-a763-4db3-8373-d27514c1481e-v1/M_VinAvi.fst",
    "http://mpassets.highfidelitydasss.com/0c2c264b-2fd2-46a4-bf80-de681881f66b-v1/F_MotRac.fst",
    "http://mpassets.highfidelity.com/faf505f1-4fd1-4ed2-8909-816af246c48f-v1/M_VicGen.fst",
    "http://mpassets.highfidelity.com/d807a7d2-5122-4436-a6f9-3173c94d1c49-v1/M_SuaGen.fst",
    "http://mpassets.highfidelity.com/1dd41735-06f4-45a3-9ec0-d05215ace77b-v1/M_MarSen.fst",
    "http://mpassets.highfidelity.com/2cad3894-8ab3-4ba5-a723-0234f93fbd6a-v1/M_BowBea.fst",
    "http://mpassets.highfidelity.com/cf0eb1be-9ec7-4756-8eaf-ac8f3ec09eba-v1/F_ClaDef.fst",
    "http://mpassets.highfidelity.com/0cedeca3-c1a4-4be9-9fd5-dad716afcc7e-v1/F_Cyria.fst",
    "http://mpassets.highfidelity.com/dc55803b-9215-47dd-9408-eb835dac4082-v1/F_ParGir.fst",
    "http://mpassets.highfidelity.com/775a8fb3-cfe7-494d-b603-a0a2d6910e55-v1/F_VinCov.fst",
    "http://mpassets.highfidelity.com/eba0d8f8-aa72-4a6b-ab64-4d3fd4695b20-v1/F_VogHei.fst",
    "http://mpassets.highfidelity.com/4f400c78-38f9-42af-b03b-11b5451d41b9-v1/M_MidRog.fst",
    "http://mpassets.highfidelity.com/ad774d79-13f1-46e2-87c9-de49a261b264-v1/F_GunSli.fst",
    "http://mpassets.highfidelity.com/5acbaefa-5455-49a2-8d40-89d12aa393ca-v1/M_KniWol.fst",
    "http://mpassets.highfidelity.com/aaa1b0a8-3e1b-492a-9aee-600e5dc907db-v1/F_RetSciSuit.fst",
    "http://mpassets.highfidelity.com/d8da10b6-25c1-40e2-9a66-369316c722d7-v1/F_AniSuit.fst",
    "http://mpassets.highfidelity.com/f3fbb9f4-e159-49ed-ac32-03af9056b17e-v1/matthew.fst",
    "http://mpassets.highfidelity.com/0c954ba0-4d87-4353-b65e-c45509f85658-v1/priscilla.fst",
    "http://mpassets.highfidelity.com/e76946cc-c272-4adf-9bb6-02cde0a4b57d-v1/9e8c5c42a0cbd436962d6bd36f032ab3.fst",
    "http://mpassets.highfidelity.com/72e083ee-194d-4113-9c61-0591d8257493-v1/skeleton_Rigged.fst",
    "http://mpassets.highfidelity.com/f14bf7c9-49a1-4249-988a-0a577ed78957-v1/beingOfLight.fst",
    "http://mpassets.highfidelity.com/1b7e1e7c-6c0b-4f20-9cd0-1d5ccedae620-v1/bb64e937acf86447f6829767e958073c.fst",
    "http://mpassets.highfidelity.com/67d7c7aa-c300-4d03-85f4-86480130eaa5-v1/F_StarCrew.fst",
    "http://mpassets.highfidelity.com/d293ef06-c659-467a-9288-c3cbaff0372a-v1/arya_avatar.fst",
    "http://mpassets.highfidelity.com/faf249d5-12a8-48e2-a08e-fb0c33087011-v1/F_Ranger.fst",
    "http://mpassets.highfidelity.com/b4502145-15eb-4023-b7d6-a81c5cbf6abf-v1/F_FitTra.fst",
    "http://mpassets.highfidelity.com/548d0792-0bac-4933-bbfc-57d71912d77e-v1/M_OutMer.fst",
    "http://mpassets.highfidelity.com/caa61e5d-5629-4165-81d8-6a7eb55e942d-v1/F_DeaSur.fst",
    "http://mpassets.highfidelity.com/2cad3894-8ab3-4ba5-a723-0234f93fbd6a-v1/M_BowBea.fst",
    "http://mpassets.highfidelity.com/fd4fa45a-9d2a-463e-a484-f9d1b3bba724-v1/M_BeaWar.fst",
    "http://mpassets.highfidelity.com/367a5b60-8a92-4d56-a152-a00f3086f02b-v1/M_Espio.fst",
    "http://mpassets.highfidelity.com/ab466729-31da-4b4c-a33c-366f7c1d38e5-v1/M_MMAFig.fst",
    "http://mpassets.highfidelity.com/b0795a0c-493d-4abd-b4cc-5f32e6d6df46-v1/M_SalMer.fst",
    "http://mpassets.highfidelity.com/0a1d44bf-a988-4199-b29e-a532ab85a2e8-v1/M_StaShi.fst",
    "http://mpassets.highfidelity.com/d807a7d2-5122-4436-a6f9-3173c94d1c49-v1/M_SuaGen.fst",
    "http://mpassets.highfidelity.com/cb20212c-36f2-4d41-bdad-132361ca6ff4-v1/M_TreTee.fst",
    "http://mpassets.highfidelity.com/830988dc-619a-4e88-96e1-a19fa0aaa30f-v1/M_UrbEnf.fst",
    "http://mpassets.highfidelity.com/faf505f1-4fd1-4ed2-8909-816af246c48f-v1/M_VicGen.fst",
    "http://mpassets.highfidelity.com/883ac86f-dd29-4676-8bda-7dd52fb6465f-v1/M_WasWan.fst",
    "http://mpassets.highfidelity.com/ede82c38-c66e-4f67-9e0b-0bb0782db18f-v1/M_WesOut.fst",
    "http://mpassets.highfidelity.com/04c9a1e9-0390-4a7f-b6c6-5f135c19e3fb-v1/F_ArmTro.fst",
    "http://mpassets.highfidelity.com/e863348f-a777-4f36-86e6-af6e65ffa161-v1/F_BloSam.fst",
    "http://mpassets.highfidelity.com/cf0eb1be-9ec7-4756-8eaf-ac8f3ec09eba-v1/F_ClaDef.fst",
    "http://mpassets.highfidelity.com/0cedeca3-c1a4-4be9-9fd5-dad716afcc7e-v1/F_Cyria.fst",
    "http://mpassets.highfidelity.com/da2ad4cd-47d4-41da-b764-41f39ff77e30-v1/F_JerGir.fst",
    "http://mpassets.highfidelity.com/534d42f8-ec13-4145-929f-5c8facac2fb7-v1/F_LegFig.fst",
    "http://mpassets.highfidelity.com/dc55803b-9215-47dd-9408-eb835dac4082-v1/F_ParGir.fst",
    "http://mpassets.highfidelity.com/f823e831-d8c4-4191-a3bd-427e406e69f9-v1/F_Shinjuku.fst",
    "http://mpassets.highfidelity.com/eba0d8f8-aa72-4a6b-ab64-4d3fd4695b20-v1/F_VogHei.fst",
    "http://mpassets.highfidelity.com/13277c09-892f-4a5e-b9a5-8994a37d68bf-v1/F_WasWar.fst",
    "http://mpassets.highfidelity.com/9b589fbb-59e4-47a9-8b3f-bf8d3a0bd1d8-v1/M_LawSur.fst",
    "http://mpassets.highfidelity.com/4f400c78-38f9-42af-b03b-11b5451d41b9-v1/M_MidRog.fst",
    "http://mpassets.highfidelity.com/c90d755d-0456-48fd-b98c-09c4d85cd481-v1/M_MouOff.fst",
    "http://mpassets.highfidelity.com/c2ed3b9a-b3a9-4424-9fd2-8a798209f32b-v1/M_PerTra.fst",
    "http://mpassets.highfidelity.com/c48928ac-7657-41f4-bbdc-9b47385736ab-v1/M_SpaMar.fst",
    "http://mpassets.highfidelity.com/d029ae8d-2905-4eb7-ba46-4bd1b8cb9d73-v1/4618d52e711fbb34df442b414da767bb.fst",
    "http://mpassets.highfidelity.com/c85c497d-c87b-42b1-9bbf-5405e05a0ad3-v1/M_ArmSol.fst",
    "http://mpassets.highfidelity.com/1dd41735-06f4-45a3-9ec0-d05215ace77b-v1/M_MarSen.fst",
    "http://mpassets.highfidelity.com/bd80a6d7-7173-489e-87c6-f7ee56e65530-v1/M_RetFut.fst",
    "http://mpassets.highfidelity.com/8872ae86-a763-4db3-8373-d27514c1481e-v1/M_VinAvi.fst",
    "http://mpassets.highfidelity.com/f798d926-9a9e-481a-b298-af0e45451252-v1/F_Assassin.fst",
    "http://mpassets.highfidelity.com/ad774d79-13f1-46e2-87c9-de49a261b264-v1/F_GunSli.fst",
    "http://mpassets.highfidelity.com/0c2c264b-2fd2-46a4-bf80-de681881f66b-v1/F_MotRac.fst",
    "http://mpassets.highfidelity.com/aaa1b0a8-3e1b-492a-9aee-600e5dc907db-v1/F_RetSciSuit.fst"
];

var AVATAR_URL = nameArray[Math.floor(Math.random() * nameArray.length)];
var ANIMATION_URL = "http://howard-stearns.github.io/models/resources/avatar/animations/walk_fwd.fbx";
var SOUND_URL = "https://s3.amazonaws.com/hifi-public/sounds/cocktail-party/" + sound_filenames[Math.floor(Math.random() * sound_filenames.length)];
var CHANCE_OF_SOUND = 0.005;

// NOTE: adjust CROWD parameters to suit your domain content and test needs
var CROWD_CENTER = {x: 0, y: 0, z: 0};
var MIN_CROWD_RADIUS = 2;
var MAX_CROWD_RADIUS = 6;

var ANIMATION_DATA  = {
    "url": ANIMATION_URL,
    "startFrame": 0.0,
    "endFrame": 300.0,
    "timeScale": 1.0,
    "loopFlag": true
};

var orientation = Quat.fromPitchYawRollDegrees(0, 0, 0);
var crowdRadius = Math.random() * (MAX_CROWD_RADIUS - MIN_CROWD_RADIUS) + MIN_CROWD_RADIUS;
var TWO_PI = 6.283185307;
var crowdAngle = Math.random() * TWO_PI;

var sound = SoundCache.getSound(SOUND_URL);
var makeSounds = false;

Avatar.position = CROWD_CENTER;
Avatar.orientation = orientation;
Avatar.skeletonModelURL = AVATAR_URL;
Avatar.position = { x: CROWD_CENTER.x + crowdRadius * Math.cos(crowdAngle),
                    y: CROWD_CENTER.y,
                    z: CROWD_CENTER.z + crowdRadius * Math.sin(crowdAngle) };
Avatar.startAnimation(ANIMATION_DATA.url, 30, 1.0, ANIMATION_DATA.loopFlag, false, ANIMATION_DATA.startFrame, ANIMATION_DATA.endFrame);

Agent.isListeningToAudioStream = true;
Agent.isAvatar = true;

var yaw = 0; // degrees
var yawSpeed = 30; // 30 degrees/sec = 1 revolution every 6 seconds

function idle(dt) {
    // rotate
    yaw += yawSpeed * dt;
    if (yaw > 360) {
        yaw -= 360;
    }
    Avatar.orientation = Quat.fromPitchYawRollDegrees(0, yaw, 0);

    EntityViewer.setPosition(Avatar.position);
    EntityViewer.setOrientation(Avatar.orientation);
    //EntityViewer.queryOctree();

    // Make a sound
    if (makeSounds && Math.random() < CHANCE_OF_SOUND) {
       Agent.playAvatarSound(sound);
    }
}
Script.update.connect(idle);

