import { Client } from "boardgame.io/client";

// Wrap the regular Client and after intially connecting attempt to update the PlayerID with an available seat
export const AutoJoinClient = <G>(
  ...args: Parameters<typeof Client<G>>
): ReturnType<typeof Client<G>> => {
  const client = Client(...args);

  // If the client already has a playerID there is no need to attempt to take
  // an open seat
  if (client.playerID) {
    return client;
  }

  const unsubscribe = client.subscribe((state) => {
    // Wait for a non-null state update indicating the connection is live
    if (state && client.matchData) {
      // check for available seats
      let openSeat: string | undefined = undefined;
      client.matchData.forEach((seat, id) => {
        if (!seat.isConnected && !openSeat) {
          openSeat = String(id);
        }
      });

      // Unsubscribe no matter what
      unsubscribe();

      client.overrideGameState(null);

      if (openSeat) {
        client.updatePlayerID(openSeat);
      }
    }
  });

  return client;
};
