# Retain Legends

This readme file of Retain Legends contains:
1. Group members
2. Introduction
3. Documentation
4. User manual
5. Screenshots
6. Link to Video Demo
7. Acknowledgement
8. References

## Group Members
This project is a solo work done by Mohamad Razlan Nazmi bin Ramli.

## Introduction
This game is created in the need to fulfil the Game Physics Project #1 requirement while preparing myself with skills of Phaser game development together with physics application in game. This creation of this Phaser web game is based on the theme ‘Hunter / Hunted’, showcasing a simple game design that is fun to play.

## Documentation
This game is about a novice magician named Red Hood, trying to maintain the peace of his village from the attacks of giants, called Legends. Using his sacred bow and arrow, this little magician has to detain all of these Legends before everything becomes a chaos. 
Fighting against powerful creatures, Red Hood will have to be cautious in every step, avoiding obstacles while capturing those Legends.

## User Manual

### Installation Guide
1. Download the files in this repository into your machine.
3. Install an extension in Visual Studio Code called Live Server.
4. From Visual Studio Code, open the directory to this project folder.
5. Click on ‘game.js’.
6. With the tab of ‘game.js’ opened, click on the ‘Go Live’ button at the bottom right of the Visual Studio Code to run the Live Server extension.
7. A browser with the game will be launched automatically.

### Player Controls
1. Use the arrow LEFT and RIGHT keys to move.
2. Use the arrow UP key to jump.
3. Press the SPACE key to shoot the sacred arrow. The sacred arrow have a cooldown of 2 seconds.

### How to Play
1. At the home screen, there is a Play button. By clicking it, the game will redirect the player into the game scene.
2. Using controls given, the player will have to survive the scene while acquiring their best points. Colliding with several objects in the game will reduce the life points of the player. Once the player's health hit 0 point, the scene ends.
3. At the end scene, the player's score will be displayed and the player can choose to redirect to the home screen or replay the game.

### Gameplay and Features

#### Sacred Arrow Shooting Mechanics
The player has to shoot the Legends with the sacred arrow. If the arrow hits a Legend, the Legend will shrink. While the Legend is in the shrink mode, the player can collect the Legend. For every Legend collected, one score point will be obtained. The Legends will be respawned again when the existing Legends have been caught. Collect as many points as you can without dying!

#### Enemies
The Legends have a powerful aura surrounding them. Due to this, when the player collides with any of the Legends, the player will take some damage and a life point will be deducted.
Different Legends will perform different actions.
1. The Leaf Legend will shoot nature arrows from time to time. Getting hit by these arrows reduces the player's life points by 1.
2. The Fire Legend will perform a flame slash when the player is near to this Legend. Upon getting hit by these slashes, the player's life points will be reduced by 1.
3. The Wind Legend will fly towards the player in the scene. When this Legend is hit by the sacred arrow, the chase will stop and this Legend will fall onto the ground.

#### Taking Damage
If the player got hit by Legends or any Legend's projectiles, the player's health point will be reduced and the player will be in an invisible mode for 2 seconds. Once the invisible mode is time out, the player will be re respawn at the initial position.

#### Power Ups
After a certain period of time, a Mythical Book power-up will appear. By collecting this book, a wide magical sacred effect will be performed and all the Legends in the scene will shrink. If this power-up book is not collected in a certain duration, it will disappear again. 

## Screenshots
Here are some snapshots of the game:
<img width="960" alt="rl image 2" src="https://github.com/razlannazmi/razlannazmi-retainlegends/assets/170949311/48046b3c-2349-4fe7-9f9d-e3c71f5e6a52"> <br />
The home screen of the game. <br />

<img width="960" alt="rl image 1" src="https://github.com/razlannazmi/razlannazmi-retainlegends/assets/170949311/2f2046d5-510a-40c4-a15a-ca1aa3c4b654"> <br />
Example of gameplay scene.  <br />

<img width="960" alt="rl image 3" src="https://github.com/razlannazmi/razlannazmi-retainlegends/assets/170949311/c5d18a52-6454-4851-9011-b74e2355a570"> <br />
Player got hit.  <br />

<img width="960" alt="rl image 4" src="https://github.com/razlannazmi/razlannazmi-retainlegends/assets/170949311/dbf2d92c-0bfe-448e-a9f5-874dcc89a8fb"> <br />
Background changes based on current scores.  <br />

<img width="960" alt="rl image 6" src="https://github.com/razlannazmi/razlannazmi-retainlegends/assets/170949311/cc37e6d1-940c-4d77-98e3-434c0316c6a3"> <br />
Power-up book appears at the bottom left of the scene.  <br />

<img width="960" alt="rl image 5" src="https://github.com/razlannazmi/razlannazmi-retainlegends/assets/170949311/0e9fea3f-61f6-4cd1-9ebe-7a05d1cc7c32"> <br />
Game over screen.  <br />

## Link to Video Demo
The link to view the demo gameplay of this game is as below:
https://drive.google.com/drive/folders/1RyCNRPKA1zXX1o9xax_ek1gK9x0tO7Vu?usp=sharing

## Acknowledgement
As this project has been completed, I would like to deliver my highest gratitude to all who have contributed or been involved in this project, either directly or indirectly, that assist my progress towards the completion of this game. 

First and foremost, I would like to express my heartfelt thanks towards my lecturer, Dr. Wong Ya Ping, for first-hand knowledge of all the contents taught in Game Physics lesson. I am deeply grateful to my classmates who provide me with guidance in learning Phaser, understanding the physics concepts and completing this project. 

Last but not least, to everyone who contributed to the development of this game in any capacity, I am profoundly thankful to all of you. Your efforts, support, and belief in this project have made it a reality. I hope everyone enjoys playing the game as much as I enjoyed creating it.

## References
The original structure of the code of this project is taken from the Game Physics lab exercise. These codes act as the fundamental structure of the game that is developed from time to time by adding necessary features into the game. In most cases, the ideas of some codes in the project are driven by tutorial websites online such as StackOverflow, W3Schools and others. Some of the code is also written with the help of AI chatbot and assistance online.
