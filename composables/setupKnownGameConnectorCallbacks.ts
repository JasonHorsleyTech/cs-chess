import GameConnector from "~~/models/GameConnector";
import GameRunner from "~~/models/GameRunner";

const setupKnownGameConnectorCallbacks = (
  TheGameConnector: GameConnector,
  TheGameRunner: GameRunner
) => {
  TheGameConnector.callbacks["purchase-and-place"] = {
    resolve: (content: DataConnectionEvent["content"]) => {
      // Will throw if purchase invalid, which will catch inside GameConnector.processNewEvent and send a failed response code.
      TheGameRunner.purchaseAndPlace({
        pieceType: content.pieceType,
        location: content.location,
        player: content.player,
      });

      return content;
    },
    reject: () => {},
  };
};

export default setupKnownGameConnectorCallbacks;
