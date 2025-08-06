import React from 'react'
import styles from './commands.module.scss'
import { links, info } from '../config'
import { Commands, Command } from '../typings'
import ListElement from '../ListElement/ListElement'

const rawCommands: Command[] = [
	{
		name: 'help',
		icon: 'fas fa-fw fa-question-circle',
		description: 'List all available commands',
		execute(app) {
			const { commands } = app.state
			return (
				<>
					Available commands:
					{[...commands.values()].map(
						({ icon, name, description }, key) => (
							<ListElement
								key={key}
								icon={icon}
								name={name}
								description={description}
								help
							/>
						)
					)}
				</>
			)
		},
	},
	{
		name: 'load_process',
		icon: 'fas fa-fw fa-info-circle',
		description: 'Show information about the server',
		execute(app) {
			const { userDataLoaded, userData } = app.state
			if (!userDataLoaded)
				return <>User data could not be fetched</>
			const { avatar_url, login, name, bio } = userData
			return (
				<div className={styles.infoWrapper}>
					<div className={styles.infoInner}>
						<img
							src="/img/ui/avatar.gif" // Fallback image
							className={styles.avatar}
							alt="GitHub avatar"
						/>
						<div className={styles.content}>
							<div className={styles.header}>
								<strong>{name}</strong>{' '}
								<span className="muted">@{login}</span>
							</div>
							<em className={styles.bio}>"...{bio}"</em>
							<div className={styles.info}>{info}</div>
						</div>
					</div>

					<div className={styles.icons}>
						<i className="fab fa-fw fa-vuejs"></i>
						{/* <i className="fab fa-fw fa-sass"></i> */}
						<i className="fab fa-fw fa-js-square"></i>
						<i className="fab fa-fw fa-node-js"></i>
						<i className="fab fa-fw fa-python"></i>
						{/* <i className="fab fa-fw fa-java"></i> */}
					</div>
				</div>
			)
		},
	},
	{
		name: 'recovery_mode',
		icon: 'fas fa-fw fa-tools',
		description: 'Initiate HDD recovery mode, one lost file at a time',
		execute() {
			return (
				<>
					{links.map(({ icon, name, link, description }, key) => (
						<ListElement
							key={key}
							icon={icon}
							name={name}
							link={link}
							description={description}
						/>
					))}
				</>
			)
		},
	},
	{
		name: 'shared_drive',
		icon: 'fas fa-fw fa-link',
		description: 'P2P shared drive, for the lost and found',
		execute(app) {
			const { projectDataLoaded, projectData } = app.state
			if (!projectDataLoaded)
				return <>Project data could not be fetched</>
			return (
				<>
					{projectData.map(
						({ name, html_url, description }: any, key: number) => (
							<ListElement
								key={key}
								icon={'fab fa-spinner fa-spin'}
								name={name}
								link={html_url}
								description={description}
							/>
						)
					)}
				</>
			)
		},
	},

	{
		name: 'clear',
		icon: 'fas fa-fw fa-eraser',
		description: 'Clear terminal screen',
		execute(app) {
			app.setState({
				...app.state,
				record: [],
			})
		},
	},
	{
		name: 'myip',
		icon: 'fas fa-spinner fa-spin',
		description: 'Return your IPv4',
		execute(app) {
			const { setState } = app;
			app.setState({
				...app.state,
				record: [
					...app.state.record,
					{ command: "myip", output: <div>Fetching IP...</div> },
				],
			});
			
			fetch("https://api.ipify.org/?format=json")
				.then((res) => res.json())
				.then((data) => {
					const updatedRecord = [...app.state.record];
					updatedRecord.pop(); 
					updatedRecord.push({
						command: "myip",
						output: <div>IP: {data.ip}</div>,
					});
			
					app.setState({
						...app.state,
						record: updatedRecord,
					});
				})
				.catch((err) => {
					const updatedRecord = [...app.state.record];
					updatedRecord.pop();
					updatedRecord.push({
						command: "myip",
						output: <div>Error fetching IP: {err.message}</div>,
					});
			
					app.setState({
						...app.state,
						record: updatedRecord,
					});
				});
				
		},
	}
]
const commands: Commands = new Map(rawCommands.map(cmd => [cmd.name, cmd]))

export default commands
