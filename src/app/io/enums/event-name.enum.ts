export enum IoInput {
  chatMessage = 'chat-message-request',
  createLobby = 'create-lobby-request',
  joinLobby = 'join-lobby-request',
  destroyLobby = 'destroy-lobby-request',
  /* lobbyData = 'lobby-data-request' ,*/ // > /dev/null
  lobbyList = 'lobby-list-request',
  leaveLobby = 'leave-lobby-request',
  startGame = 'start-game-request',
  pickMeme = 'pick-meme-request',
  getVote = 'get-vote-request',
  changePhase = 'change-phase-request',
}

export enum IoOutput {
  error = 'error',
  chatMessage = 'chat-message',
  createLobby = 'create-lobby',
  joinLobby = 'join-lobby',
  leaveLobby = 'leave-lobby',
  deleteLobby = 'delete-lobby',
  changePhase = 'change-phase',
}
