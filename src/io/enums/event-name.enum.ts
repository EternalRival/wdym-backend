export enum IoInput {
  chatMessageRequest = 'messageToServer', // "chat-message-request"
  createLobbyRequest = 'createLobbyRequest', // "create-lobby-request"
  joinLobbyRequest = 'joinLobbyRequest', // "join-lobby-request"
  destroyLobbyRequest = 'destroy-lobby-request', // "destroy-lobby-request"
  lobbyDataRequest = 'getLobbyData', // "lobby-data-request"
  lobbyListRequest = 'getLobbyList', // "lobby-list-request"
  isPasswordCorrectRequest = 'isPasswordCorrectRequest', // "is-password-correct-request"
  isLobbyNameUniqueRequest = 'isLobbyNameUniqueRequest', // "is-lobby-name-unique-request"
  leaveLobbyRequest = 'leave-lobby-request', // "leave-lobby-request"
  randomMemesRequest = 'getRandomMemes', // "random-memes-request"
}

export enum IoOutput {
  chatMessage = 'globalChatMessage', // chat-message
  createLobby = 'create-lobby', // create-lobby
  joinLobby = 'joinLobby', // join-lobby
  leaveLobby = 'leave-lobby', // leave-lobby
  deleteLobby = 'delete-lobby', // delete-lobby
}
