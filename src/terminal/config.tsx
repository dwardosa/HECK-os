import React from 'react'
const github_username = 'USER420'
const discord_usertag = 'USER420'
const discord_userid = 'heck'
const email = 'Alex@blancpages.co.uk'

const projects = [
]

const links = [
	{
		name: 'Unwind',
		icon: 'fab fa-fw fa-music',
		link: 'https://s.disco.ac/xhxzgtiwgsuy',
		description: 'Lost and found...',
	},
	{
		name: 'Discord',
		link: `https://discord.com/users/${discord_userid}`,
		icon: 'fab fa-fw fa-discord',
		description: `Discord for the hottest drops`,
	},
	{
		name: 'HDD Recovery complete.app',
		icon: 'fab fa-fw fa-music',
		link: 'https://333heck.disco.ac/playlist-new/17365703?date=20250616&user_id=1052871&signature=oTHrz0jlZTknms0XL9vbSA8kyXQ%3AP1eMjqc8',
		description: 'Its all there, just not in the right place',
	},
	{
		name: 'E-mail',
		icon: 'fas fa-fw fa-at',
		link: `mailto:${email}`,
		description: 'Feedback loop',
	},
]

const info = (
	<>
		<p>Hello, My HDD is FUCKED. Servers gone wayward an all, maudness</p>
		<p>
			I Lost all me tunes init.
		</p>
		<p>
			Can you help?
			</p>
	</>
)

export {
	github_username,
	discord_usertag,
	discord_userid,
	email,
	projects,
	links,
	info,
}
