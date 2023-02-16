export enum IoInput {
  chatMessage = 'chat-message-request',
  createLobby = 'create-lobby-request',
  joinLobby = 'join-lobby-request',
  destroyLobby = 'destroy-lobby-request',
  lobbyData = 'lobby-data-request',
  lobbyList = 'lobby-list-request',
  leaveLobby = 'leave-lobby-request',
  randomMemes = 'random-memes-request',
  startGame = 'start-game-request',
  pickMeme = 'pick-meme-request',
}

export enum IoOutput {
  chatMessage = 'chat-message',
  createLobby = 'create-lobby',
  joinLobby = 'join-lobby',
  leaveLobby = 'leave-lobby',
  deleteLobby = 'delete-lobby',
  changePhase = 'change-phase',
}
