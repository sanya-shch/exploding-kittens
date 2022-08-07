import React from 'react';

import * as cardTypeIcons from '../../assets/cardTypeIcons';
import { expansions } from "../../constants/expansions";

import './style.scss';

const FieldGuideBlock = ({ expansionsList }) => (
  <div className="field_guide_block">
    <h2>Field Guide</h2>

    <div className="item">
      <div className="header_block">
        <img src={cardTypeIcons.explodingKitten} alt="" width={60} height={60} />
        <h3>Exploding Kitten</h3>
      </div>
      <p>Unless you have a Defuse Card, you're dead. Discard all of your cards, including the Exploding Kitten.</p>
    </div>

    <div className="item">
      <div className="header_block">
        <img src={cardTypeIcons.defuse} alt="" width={60} height={60} />
        <h3>Defuse</h3>
      </div>
      <p>If you drew an Exploding Kitten, you can play this card instead of dying. Place your Defuse Card in the Discard Pile.</p>
      <p>Then take the Exploding Kitten, and without reordering or viewing the other cards, secretly put it back in the Draw Pile anywhere you'd like.</p>
      <p>Want to hurt the player right after you? Put the Kitten right on top of the deck. If you'd like, hold the deck under the table so that no one else can see where you put it.</p>
      <p>Your turn is over after playing this card.</p>
    </div>

    <div className="item">
      <div className="header_block">
        <img src={cardTypeIcons.attack} alt="" width={60} height={60} />
        <h3>Attack</h3>
      </div>
      <p>Do not draw any cards. Instead, immediately force the next player to take 2 turns in a row. Play then continues from that player.</p>
    </div>

    <div className="item">
      <div className="header_block">
        <img src={cardTypeIcons.favor} alt="" width={60} height={60} />
        <h3>Favor</h3>
      </div>
      <p>Force any other player to give you 1 card from their hand. They choose which card to give you.</p>
    </div>

    <div className="item">
      <div className="header_block">
        <img src={cardTypeIcons.nope} alt="" width={60} height={60} />
        <h3>Nope</h3>
      </div>
      <p>Stop any action except for an Exploding Kitten or a Defuse Card. Imagine that any card beneath a Nope Card never existed.</p>
      <p>A Nope can also be played on another Nope to negate it and create a Yup, and so on.</p>
      <p>You can even play a Nope on a SPECIAL COMBO.</p>
    </div>

    <div className="item">
      <div className="header_block">
        <img src={cardTypeIcons.shuffle} alt="" width={60} height={60} />
        <h3>Shuffle</h3>
      </div>
      <p>Shuffle the Draw Pile thoroughly. (Useful when you know there's an Exploding Kitten coming.)</p>
    </div>

    <div className="item">
      <div className="header_block">
        <img src={cardTypeIcons.skip} alt="" width={60} height={60} />
        <h3>Skip</h3>
      </div>
      <p>Immediately end your turn without drawing a card.</p>
      <p>If you play a Skip Card as a defense to an Attack Card, it only ends 1 of the 2 turns. 2 Skip Cards would end both turns.</p>
    </div>

    <div className="item">
      <div className="header_block">
        <img src={cardTypeIcons.seeFuture} alt="" width={60} height={60} />
        <h3>See the Future</h3>
      </div>
      <p>Privately view the top 3 cards from the Draw Pile and put them back in the same order. Don't show the cards to the other players.</p>
    </div>

    <div className="item">
      <div className="header_block">
        <img src={cardTypeIcons.tacocat} alt="" width={60} height={60} />
        <img src={cardTypeIcons.cattermelon} alt="" width={60} height={60} />
        <img src={cardTypeIcons.hairyPotatoCat} alt="" width={60} height={60} />
        <img src={cardTypeIcons.beardCat} alt="" width={60} height={60} />
        <img src={cardTypeIcons.rainbowRalphingCat} alt="" width={60} height={60} />
        <h3>Cat Cards</h3>
      </div>
      <p>These cards are powerless on their own, but if you collect any 2 matching Cat Cards, you can play them as a Pair to steal a random card from any player.</p>
    </div>

    {expansionsList?.includes(expansions.ImplodingKittens) && (
      <>
        <div className="item">
          <div className="header_block">
            <img src={cardTypeIcons.impendingImplodingKitten} alt="" width={60} height={60} />
            <h3>Imploding Kitten</h3>
          </div>
          <p>When this card is drawn, put it back into the Draw Pile FACE UP anywhere you’d like in secret. Do not use a Defuse Card.</p>
          <p>When you have no choice but to draw this card face up, you immediately implode and are out of the game. This card cannot be defused nor can it be noped.</p>
        </div>

        <div className="item">
          <div className="header_block">
            <img src={cardTypeIcons.reverse} alt="" width={60} height={60} />
            <h3>Reverse</h3>
          </div>
          <p>Reverse the order of play and end your turn without drawing a card.</p>
          <p>If there are only two players, this card acts like a Skip card.</p>
          <p>If you play this card after you’ve been attacked, the order of play is reversed, but you’ve only ended 1 of your 2 turns.</p>
        </div>

        <div className="item">
          <div className="header_block">
            <img src={cardTypeIcons.drawFromTheBottom} alt="" width={60} height={60} />
            <h3>Draw from the Bottom</h3>
          </div>
          <p>End your turn by drawing the bottom card from the Draw Pile.</p>
        </div>

        <div className="item">
          <div className="header_block">
            <img src={cardTypeIcons.feral} alt="" width={60} height={60} />
            <h3>Feral Cat</h3>
          </div>
          <p>Use as any Cat Card (any card that is powerless on its own).</p>
          <p>This card cannot be used as a non-Cat Card (Shuffle, Attack, etc).</p>
        </div>

        <div className="item">
          <div className="header_block">
            <img src={cardTypeIcons.alterTheFuture} alt="" width={60} height={60} />
            <h3>Alter the Future</h3>
          </div>
          <p>Privately view the top three cards from the Draw Pile and rearrange them in any order you’d like. Return them to the top of the Draw Pile face down, then continue with your turn.</p>
        </div>

        <div className="item">
          <div className="header_block">
            <img src={cardTypeIcons.targetedAttack} alt="" width={60} height={60} />
            <h3>Targeted Attacks</h3>
          </div>
          <p>Immediately end your turn(s) without drawing a card and choose any player to take 2 turns in a row.</p>
        </div>
      </>
    )}

    <h2>Special Combos</h2>

    <div className="item">
      <h4>Two of a Kind</h4>
      <p>Playing matching Pairs of Cat Cards (where you get to steal a random card from another player) no longer only applies to pairs of Cat Cards. It now applies to ANY pair of cards with the same title (a pair of Shuffle Cards, a pair of Skip Cards, etc). Ignore the instructions on the cards when you play a combo.</p>
    </div>

    <div className="item">
      <h4>Three of a Kind</h4>
      <p>When you play 3 matching cards (any 3 cards with the same title), you get to pick a player and name a card. If they have that card, they must give one to you. If they don't have it, you get nothing. Ignore the instructions on the cards when you play a combo.</p>
    </div>

    <div className="item">
      <h4>Five different ones</h4>
      <p>You can take any card from the discarded deck.</p>
    </div>
  </div>
);

export default FieldGuideBlock;
