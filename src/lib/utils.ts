export async function resetGame(url: string) {
	await fetch(url, {
		method: 'DELETE'
	});
}
export async function handleMovement(idx: number, url: string) {
	await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ idx })
	});
}
