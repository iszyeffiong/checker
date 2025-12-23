import React, { useState, useCallback } from 'react';
import { Dice, Chip, Card, Sparkle, TwitterIcon } from './components/DoodleIcons';
import { Logo } from './components/Logo';
import { EligibilityStatus, WhitelistResult } from './types';
import { getOracleReading } from './services/geminiService';
import { checkWhitelistStatus, updateWalletAddress } from './services/whitelistService';



const App: React.FC = () => {
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<EligibilityStatus>(EligibilityStatus.IDLE);
  const [result, setResult] = useState<WhitelistResult | null>(null);
  const [walletInput, setWalletInput] = useState('');
  const [foundUsername, setFoundUsername] = useState<string | null>(null);

  /* Removed unnecessary strict EVM validation to allow usernames */
  // const isValidEVM = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);

  const checkWhitelist = useCallback(async () => {
    const trimmedAddress = address.trim();

    /* Simplified validation: just ensure it's not empty */
    if (trimmedAddress.length < 2) {
      setResult({ status: EligibilityStatus.ERROR, message: "Type something!" });
      setStatus(EligibilityStatus.ERROR);
      return;
    }

    setStatus(EligibilityStatus.CHECKING);
    setResult(null);

    const normalizedInput = trimmedAddress.toLowerCase();
    const checkResult = await checkWhitelistStatus(normalizedInput);

    // Check if user was found but has no wallet address
    const isUsernameSearch = !/^0x[a-fA-F0-9]{40}$/.test(trimmedAddress);
    const missingWallet = checkResult.found &&
      isUsernameSearch &&
      checkResult.data &&
      !checkResult.data.wallet_address;

    if (missingWallet) {
      setFoundUsername(checkResult.data!.username!);
      setStatus(EligibilityStatus.MISSING_WALLET);
      setResult({
        status: EligibilityStatus.MISSING_WALLET,
        message: `Hey ${checkResult.data!.username}! You're on the list, but we need your wallet address.`
      });
      return;
    }

    const oracleText = await getOracleReading(trimmedAddress, checkResult.found);

    setTimeout(() => {
      const finalStatus = checkResult.found ? EligibilityStatus.ELIGIBLE : EligibilityStatus.NOT_ELIGIBLE;
      setStatus(finalStatus);
      setResult({
        status: finalStatus,
        oracleReading: oracleText
      });
    }, 1200);
  }, [address]);

  const submitWallet = useCallback(async () => {
    const trimmedWallet = walletInput.trim();

    // Validate it's a proper EVM address
    if (!/^0x[a-fA-F0-9]{40}$/.test(trimmedWallet)) {
      setResult({
        status: EligibilityStatus.ERROR,
        message: "Invalid wallet address! Must be 0x..."
      });
      setStatus(EligibilityStatus.ERROR);
      return;
    }

    if (!foundUsername) return;

    setStatus(EligibilityStatus.CHECKING);
    const updateResult = await updateWalletAddress(foundUsername, trimmedWallet.toLowerCase());

    if (updateResult.success) {
      setStatus(EligibilityStatus.ELIGIBLE);
      const oracleText = await getOracleReading(trimmedWallet, true);
      setResult({
        status: EligibilityStatus.ELIGIBLE,
        oracleReading: oracleText
      });
      setWalletInput('');
      setFoundUsername(null);
    } else {
      setStatus(EligibilityStatus.ERROR);
      setResult({
        status: EligibilityStatus.ERROR,
        message: `Failed to update: ${updateResult.message || 'Unknown error'}`
      });
    }
  }, [walletInput, foundUsername]);

  return (
    <div className="relative flex flex-col min-h-[100dvh] w-full overflow-y-auto p-4 md:p-8">
      {/* Decorative Background Doodles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Dice className="absolute top-[5%] left-[5%] w-12 h-12 md:w-20 md:h-20 rotate-12 opacity-5" />
        <Chip className="absolute bottom-[5%] right-[5%] w-16 h-16 md:w-24 md:h-24 -rotate-12 opacity-5" />
        <Sparkle className="absolute top-[20%] right-[10%] w-10 h-10 opacity-5 hidden sm:block" />
      </div>

      {/* Header - Scaled down for mobile to fit onepage */}
      <header className="relative z-10 w-full flex flex-col items-center flex-shrink-0 pt-2 pb-4 md:pb-8">
        <div className="transform scale-90 md:scale-100 transition-transform">
          <Logo className="mt-2" />
        </div>
        <div className="relative mt-2 md:mt-4">
          <h2 className="text-xl md:text-3xl font-bold font-marker uppercase tracking-tighter text-black">
            Whitelist Checker
          </h2>
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-black transform -rotate-1 opacity-20"></div>
        </div>
      </header>

      {/* Main Content - Centered with flex-grow, scrollable via root container */}
      <main className="relative z-10 w-full max-w-xl mx-auto flex flex-col justify-center flex-grow px-1 py-2">
        <div className="bg-white doodle-border p-5 md:p-10 sketch-shadow bg-opacity-95 backdrop-blur-md transition-all flex flex-col">

          <div className="mb-6 md:mb-8 flex-shrink-0">
            <label className="block text-lg md:text-xl mb-2 font-bold font-marker">
              EVM Wallet or Username
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="0x... or @username"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && checkWhitelist()}
                className="w-full p-3 bg-gray-50 border-b-4 border-black focus:outline-none text-base md:text-lg font-mono placeholder-gray-300 transition-all focus:bg-white"
              />
            </div>
          </div>

          <button
            onClick={checkWhitelist}
            disabled={status === EligibilityStatus.CHECKING}
            className={`w-full py-3 md:py-4 text-lg md:text-2xl font-bold doodle-button bg-yellow-300 hover:bg-yellow-400 disabled:bg-gray-100 disabled:opacity-50 flex-shrink-0 transition-transform uppercase tracking-tight md:tracking-normal`}
          >
            {status === EligibilityStatus.CHECKING ? 'SHUFFLING...' : 'CHECK WHITELIST STATUS'}
          </button>

          {/* Results Area - Allow natural height expansion */}
          <div className="mt-6 md:mt-8 flex items-center justify-center border-t-2 border-dashed border-gray-100 pt-4 min-h-[100px]">
            {status === EligibilityStatus.IDLE && (
              <p className="text-lg md:text-xl opacity-40 italic font-hand text-center leading-tight">
                Check your status above.
              </p>
            )}

            {status === EligibilityStatus.CHECKING && (
              <div className="flex flex-col items-center gap-2">
                <Dice className="w-12 h-12 text-yellow-500 animate-bounce" />
                <span className="font-hand text-xl">Consulting Oracle...</span>
              </div>
            )}

            {(status === EligibilityStatus.ELIGIBLE || status === EligibilityStatus.NOT_ELIGIBLE) && result && (
              <div className="animate-[wiggle_0.5s_ease-out] w-full text-center flex flex-col items-center">
                <h3 className={`text-2xl sm:text-3xl md:text-5xl font-bold mb-1 md:mb-2 tracking-tight break-words ${status === EligibilityStatus.ELIGIBLE ? 'text-green-600' : 'text-red-500'}`}>
                  {status === EligibilityStatus.ELIGIBLE ? 'WINNER!' : 'NO LUCK!'}
                </h3>

                <p className={`text-lg sm:text-xl font-bold mb-2 md:mb-4 font-hand uppercase ${status === EligibilityStatus.ELIGIBLE ? 'text-green-800' : 'text-red-800'}`}>
                  {status === EligibilityStatus.ELIGIBLE ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                </p>

                {status === EligibilityStatus.NOT_ELIGIBLE && (
                  <div className="mb-2 md:mb-4 p-2 md:p-3 bg-red-50 border-2 border-dashed border-red-100 rounded-lg transform -rotate-1 inline-block">
                    <a
                      href="https://discord.gg/3wsgG6yB3G"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm md:text-base font-bold text-red-900 underline hover:no-underline"
                    >
                      JOIN DISCORD TO COMPLAIN
                    </a>
                  </div>
                )}

                {result.oracleReading && (
                  <p className="text-sm sm:text-base md:text-lg font-hand leading-snug italic text-gray-700 px-1 md:px-2 max-w-[95%] mx-auto">
                    "{result.oracleReading}"
                  </p>
                )}
              </div>
            )}


            {status === EligibilityStatus.MISSING_WALLET && result && (
              <div className="animate-[wiggle_0.5s_ease-out] w-full text-center flex flex-col items-center">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 tracking-tight text-orange-600">
                  ALMOST THERE!
                </h3>

                <p className="text-base sm:text-lg font-hand mb-4 text-gray-700 px-2">
                  {result.message}
                </p>

                <div className="w-full max-w-md mb-4">
                  <label className="block text-sm md:text-base mb-2 font-bold font-marker text-left">
                    Your EVM Wallet Address
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={walletInput}
                    onChange={(e) => setWalletInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitWallet()}
                    className="w-full p-3 bg-gray-50 border-b-4 border-orange-400 focus:outline-none text-base font-mono placeholder-gray-300 transition-all focus:bg-white"
                  />
                </div>

                <button
                  onClick={submitWallet}
                  className="px-6 py-3 text-lg font-bold doodle-button bg-orange-400 hover:bg-orange-500 transition-transform uppercase"
                >
                  SUBMIT WALLET
                </button>
              </div>
            )}

            {status === EligibilityStatus.ERROR && (
              <p className="text-red-600 text-lg font-bold font-marker text-center">{result?.message}</p>
            )}
          </div>
        </div>
      </main>

      {/* Footer - Pinned to bottom, compact */}
      <footer className="relative z-10 w-full max-w-2xl mx-auto flex flex-row items-center justify-between gap-4 pt-4 border-t border-black border-opacity-5 flex-shrink-0 mb-2">
        <div className="flex items-center gap-4">
          <a
            href="https://x.com/doodleleagues"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 bg-black text-white rounded-md hover:scale-110 transition-transform"
          >
            <TwitterIcon className="w-4 h-4 md:w-5 md:h-5" />
          </a>
          <a
            href="https://discord.gg/3wsgG6yB3G"
            target="_blank"
            rel="noopener noreferrer"
            className="font-marker text-sm md:text-base hover:underline"
          >
            DISCORD
          </a>
        </div>

        <div className="text-right">
          <span className="font-hand text-lg md:text-xl font-bold block leading-none">© 2025 DoodleLeagues</span>
        </div>
      </footer>
    </div>
  );
};

export default App;