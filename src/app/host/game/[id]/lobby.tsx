import { Participant, supabase } from '@/types/types'
import { useQRCode } from 'next-qrcode'

let isVideoOpened = false;

export default function Lobby({
  participants: participants,
  gameId,
}: {
  participants: Participant[]
  gameId: string
}) {
  const { Canvas } = useQRCode()

  const onClickStartGame = async () => {
    // Check if it was rickrolled yet:

    const { data: rickroll, error: rickrollError } = await supabase
      .from('rickroll_check')
      .select('*')
      .eq('game_id', gameId).limit(1).maybeSingle();
    if (rickrollError) {
      return alert(rickrollError.message);
    }
    if (rickroll == null) {
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
      // updates the table with the rickroll to true
      const { data, error } = await supabase
        .from('rickroll_check')
        .insert({ game_id: gameId, was_rickrolled: true });
    }
    const { data, error } = await supabase
      .from('games')
      .update({ phase: 'quiz' })
      .eq('id', gameId)
    if (error) {
      return alert(error.message)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex justify-between m-auto bg-black p-12">
        <div className="w-96">
          <div className="flex justify-start flex-wrap pb-4">
            {participants.map((participant) => (
              <div
                className="text-xl m-2 p-2 bg-green-500"
                key={participant.id}
              >
                {participant.nickname}
              </div>
            ))}
          </div>

          <button
            className="mx-auto bg-white py-4 px-12 block text-black"
            onClick={onClickStartGame}
          >
            Start Game
          </button>
        </div>
        <div className="pl-4">
          {/* <img src="/qr.png" alt="QR code" /> */}
          <Canvas
            text={`https://kahoot-alternative-nine.vercel.app/game/${gameId}`}
            options={{
              errorCorrectionLevel: 'M',
              margin: 3,
              scale: 4,
              width: 400,
            }}
          />
        </div>
      </div>
    </div>
  )
}
