import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

function ClerkAvatar() {
  return (
    <div className="mr-4 bg-red-500 flex items-center justify-center w-20">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              formButtonPrimary: "bg-slate-500 hover:bg-slate-400 text-sm",
            },
          }}
        />
      </SignedIn>
    </div>
  );
}

export default ClerkAvatar;
