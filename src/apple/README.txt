Stages 1-2: hero, menu, highlights, work, studies (new look, behind ?apple=1)

1. Copy src/apple/ and src/assets/apple/ into the repo.
2. In src/App.jsx add, below the Ninja import:
   import AppleSite from './apple/AppleSite';
3. In src/App.jsx, directly above the formal-site "return (<BrowserRouter>", add:
   if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('apple')) {
     return <AppleSite onGame={() => choose('game')} />;
   }
4. Open https://ezhilnilavankalaimani.com/?apple=1, pick "Formal version".
Nothing else changes; the game and the old formal site are untouched.
