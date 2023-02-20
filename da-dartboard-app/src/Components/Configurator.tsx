import { CopyBtn } from './CopyBtn';

interface ConfiguratorProps {
  isHost: boolean;
  setIsHost: (isHost: boolean) => void;
  matchID: string;
  setMatchID: (matchID: string) => void;
  onSubmit: () => void;
}

/**
 * Form component to configure a peer-to-peer boardgame.io client.
 */
export const Configurator = ({
  isHost,
  setIsHost,
  matchID,
  setMatchID,
  onSubmit
}: ConfiguratorProps) => (
  <>
    <h2>Configure this client</h2>
    <form
      className="Configurator"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <label>
        <code>isHost</code>{' '}
        <input
          type="checkbox"
          checked={isHost}
          onChange={(e) => setIsHost(e.currentTarget.checked)}
        />
      </label>
      <div className="row">
        <label>
          <code>matchID</code>{' '}
          <input
            type="text"
            value={matchID}
            onInput={(e) => setMatchID(e.currentTarget.value)}
          />
        </label>
        <CopyBtn value={matchID} />
      </div>
      <button type="submit" className="cta">
        Connect
      </button>
    </form>
  </>
);
