
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Dog, Cat, Heart, Brain, Activity, AlertTriangle, Utensils, Stethoscope, Home, Users, Award, Sparkles, Clock, Target, Calendar, PawPrint, MessageCircle, PiggyBank, Briefcase, Ruler, Syringe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import SEO from "../components/common/SEO";


export default function EducationalContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    // Removed analytics tracking
  }, []);

  const content = [
    {
      id: 1,
      title: "Reading Your Dog's Body Language",
      category: "Dog Behavior",
      icon: Dog,
      tags: ["body language", "communication", "behavior"],
      difficulty: "Beginner",
      readTime: "4 min",
      summary: "Dogs communicate constantly through their body. Here's how to understand what they're saying.",
      content: `Understanding your dog's body language is the key to better communication and a stronger bond.

## The Basics

Dogs use their entire body to communicate - not just their tail. Pay attention to the whole picture.

**Relaxed and Happy:**
- Soft, loose body
- Gently wagging tail at mid-height
- Open mouth (looks like a smile!)
- Ears in natural position

**Stressed or Anxious:**
- Tense, stiff body
- Tail tucked between legs
- Ears pinned back
- Yawning (when not tired)
- Lip licking (without food around)
- Avoiding eye contact

**Playful:**
- Play bow (front end down, rear up)
- Bouncy, wiggly movements
- Mouth open and relaxed
- Quick, energetic movements

**Fearful:**
- Crouched or lowered body
- Tail tucked
- Ears back
- Trying to look smaller
- May urinate

**Aggressive (Get help from a professional!):**
- Stiff, still body
- Direct, hard stare
- Tail high and stiff
- Lips curled back showing teeth
- Raised hackles (hair standing up on back)

## Common Misunderstandings

**"A wagging tail means they're friendly"**
Not always! A high, stiff, fast wag can mean arousal or aggression. Look at the whole body.

**"They know they did something wrong"**
That "guilty" look? It's actually fear or submission in response to your body language and tone.

## When to Worry

If your dog suddenly shows aggressive body language, seems constantly stressed, or their behavior changes dramatically, consult your vet first (medical issues can cause behavior changes) and then a certified dog trainer.`
    },
    {
      id: 2,
      title: "What Your Cat's Tail Is Telling You",
      category: "Cat Behavior",
      icon: Cat,
      tags: ["tail", "communication", "cats"],
      difficulty: "Beginner",
      readTime: "3 min",
      summary: "A cat's tail is like a mood ring. Learn to read it and you'll understand your cat so much better.",
      content: `Cats are subtle communicators, but their tails give away everything.

## Tail Positions

**Straight up with a slight curve at the tip:**
This is the happy greeting tail! Your cat is confident and friendly. Time for pets.

**Puffed up (bottle brush tail):**
Your cat is scared or feeling threatened. They're trying to look bigger. Give them space and remove whatever's scaring them.

**Tucked between legs:**
Fear or anxiety. Common at the vet or when meeting new people. Let them come to you on their own terms.

**Low and horizontal:**
Hunting mode. They're focused on something (probably that bug on the wall).

**Wrapped around their body while sitting:**
Contentment and relaxation, like curling up with a blanket.

## Tail Movements

**Slow, gentle swishing:**
They're concentrating on something. Might be about to pounce on a toy.

**Fast, aggressive thrashing:**
Irritation or overstimulation. **Stop petting immediately** or you might get scratched or bitten.

**Quivering while standing upright:**
Excitement! Often when greeting you or waiting for dinner.

**Twitching just the tip:**
Mildly annoyed or intensely focused.

## A Word About Purring

Not in the tail, but important: cats don't only purr when happy. They also purr when stressed, injured, or at the vet. Look at the rest of their body language for context.

## Red Flags

If your cat's tail is suddenly limp, held at a weird angle, or they seem in pain when you touch it, see a vet right away.`
    },
    {
      id: 3,
      title: "Is My Pet Anxious? Signs to Watch For",
      category: "Mental Health",
      icon: AlertTriangle,
      tags: ["anxiety", "stress", "behavior"],
      difficulty: "Intermediate",
      readTime: "5 min",
      summary: "Anxiety in pets is common and treatable. Here's how to recognize it.",
      content: `Pet anxiety is more common than you'd think. The good news? It's usually very treatable.

## Signs of Anxiety in Dogs

**Behavioral:**
- Excessive barking or whining
- Destructive behavior (especially when you leave)
- Pacing back and forth
- Can't settle down or relax
- Following you everywhere
- Accidents in the house (when housetrained)

**Physical:**
- Panting (when not hot or exercising)
- Drooling more than usual
- Trembling or shaking
- Hiding
- Loss of appetite

## Signs of Anxiety in Cats

**Behavioral:**
- Excessive grooming (bald patches)
- Hiding for long periods
- Aggressive behavior
- Litter box avoidance
- Excessive meowing

**Physical:**
- Dilated pupils
- Ears back
- Tense body
- Vomiting or diarrhea (when stressed)

## Common Triggers

- **Loud noises:** Thunderstorms, fireworks, construction
- **Being alone:** Separation anxiety is real
- **Changes in routine:** Moving, new family member, schedule changes
- **Past trauma:** Especially common in rescue animals
- **Lack of socialization:** Fearful of new people, animals, or places

## What You Can Do

**Create a Safe Space:**
Give them a quiet spot where they can retreat. For dogs, a crate they love. For cats, a high perch or enclosed bed.

**Maintain Routine:**
Consistency helps anxious pets feel secure. Same feeding times, walk times, play times.

**Exercise:**
A tired pet is often a calmer pet. Physical and mental exercise both help.

**Calming Tools:**
- Pheromone diffusers (Adaptil for dogs, Feliway for cats)
- Anxiety wraps (like Thundershirts)
- White noise or calming music
- CBD treats (talk to your vet first)

**Practice Departures:**
If separation anxiety is the issue, practice leaving for very short periods and gradually increase the time.

## When to Get Professional Help

If anxiety is interfering with your pet's quality of life, they're hurting themselves, or nothing you try helps, talk to your vet. They might recommend:
- A certified animal behaviorist
- Anti-anxiety medication
- A customized behavior modification plan

Don't feel bad about needing help - anxiety is a real medical condition, not a training failure on your part.`
    },
    {
      id: 4,
      title: "Keeping Your Pet Mentally Stimulated",
      category: "Enrichment",
      icon: Brain,
      tags: ["enrichment", "mental health", "activities"],
      difficulty: "Beginner",
      readTime: "4 min",
      summary: "A bored pet is a destructive pet. Mental exercise is just as important as physical exercise.",
      content: `15 minutes of mental exercise can tire a dog out more than 30 minutes of walking. Seriously.

## Why Mental Stimulation Matters

Bored pets get into trouble. They chew furniture, bark excessively, develop anxiety, or become depressed. Mental exercise prevents this and makes them happier.

## For Dogs

**Puzzle Feeders:**
Instead of a regular bowl, use puzzle feeders or snuffle mats. Makes them work for their food.

**Training Sessions:**
5-10 minutes of training new tricks or commands. Mental workout plus bonding time.

**Nose Work:**
Hide treats around the house and let them search. Dogs LOVE using their nose.

**Rotate Toys:**
Don't give them all toys at once. Rotate them weekly so old toys feel new again.

**New Experiences:**
Different walking routes, dog-friendly stores, safe new environments.

## For Cats

**Vertical Space:**
Cat trees, wall shelves, or window perches. Cats need to climb and observe from height.

**Hunt for Food:**
Hide small portions of food around the house. Mimics natural hunting behavior.

**Interactive Play:**
Wand toys, laser pointers (always end with a physical toy they can "catch"), or moving toys.

**Puzzle Feeders:**
Same as dogs - makes them work for food.

**Window Entertainment:**
Bird feeders outside windows = cat TV. They can watch for hours.

## DIY Enrichment Ideas

**Cardboard Boxes:**
Seriously. Cats love them. Dogs love tearing them up (supervised!).

**Frozen Treats:**
Freeze treats in water or broth. They'll work to lick them out.

**Towel Roll:**
Roll treats in a towel and let them unroll it.

**Muffin Tin Game:**
Put treats in a muffin tin and cover with tennis balls. They have to remove balls to get treats.

## How Much Is Enough?

Every pet is different, but aim for:
- **High-energy breeds:** 30+ minutes of mental stimulation daily
- **Average breeds:** 15-20 minutes daily
- **Low-energy or senior pets:** 10-15 minutes daily

Split into multiple short sessions throughout the day works better than one long session.`
    },
    {
      id: 5,
      title: "How to Tell If Your Pet Is in Pain",
      category: "Health",
      icon: Stethoscope,
      tags: ["pain", "health", "symptoms"],
      difficulty: "Intermediate",
      readTime: "5 min",
      summary: "Pets hide pain instinctively. Here's how to spot the subtle signs something's wrong.",
      content: `Pets are masters at hiding pain. It's a survival instinct. You need to know what to look for.

## Universal Signs of Pain

**Behavior Changes:**
- Less active than usual
- Hiding or avoiding interaction
- Aggression when touched (unusual for them)
- Reluctance to jump, climb stairs, or play
- Changes in sleep (more or less)

**Physical Signs:**
- Limping or favoring one leg
- Hunched posture
- Trembling
- Heavy panting (dogs) or rapid breathing (cats)
- Not grooming properly (cats)
- Loss of appetite

## Dog-Specific Signs

**Facial Expression:**
- Squinted eyes
- Ears pulled back
- Tight, tense muzzle

**Vocalizing:**
- Whimpering or whining
- Yelping when touched
- Growling (when normally friendly)

**Movement:**
- Stiff gait
- Difficulty standing up
- Won't put weight on a leg

## Cat-Specific Signs

Cats are even better at hiding pain. Watch for:

**Hiding More:**
If your normally social cat suddenly hides all day, something's wrong.

**Litter Box Changes:**
Avoiding the box or crying while using it can signal pain (especially urinary issues).

**Grooming Changes:**
Either over-grooming one area or stopping grooming altogether.

**Facial Expression:**
- Ears flattened or held back
- Whiskers tense and pulled back
- Half-closed eyes
- Tense muzzle

## Common Pain Locations

**Dental Pain:**
- Dropping food
- Chewing on one side
- Pawing at face
- Drooling more than usual
- Bad breath (worse than normal)

**Arthritis/Joint Pain:**
- Stiffness after rest
- Difficulty with stairs or jumping
- Limping
- Worse in cold weather

**Abdominal Pain:**
- Hunched posture
- Won't let you touch belly
- Vomiting or diarrhea

## What to Do

**1. Call Your Vet**
Don't wait. Pain can indicate serious problems.

**2. Document Everything**
Take videos of their behavior. Write down when symptoms started, what makes it worse/better.

**3. Never Give Human Pain Meds**
Ibuprofen, Tylenol, aspirin - all can be fatal to pets. Only give medication prescribed by your vet.

**4. Keep Them Comfortable**
Soft bedding, quiet space, easy access to food and water.

## Emergency Signs

Go to the emergency vet immediately if:
- Unable to stand or walk
- Extreme pain (screaming, biting at themselves)
- Difficulty breathing
- Pale or blue gums
- Collapse or loss of consciousness
- Bloated, hard abdomen

Trust your instincts. You know your pet best. If something feels wrong, it probably is.`
    },
    {
      id: 6,
      title: "Exercise Needs: How Much Is Enough?",
      category: "Physical Health",
      icon: Activity,
      tags: ["exercise", "activity", "health"],
      difficulty: "Beginner",
      readTime: "4 min",
      summary: "Too little exercise = behavior problems and weight gain. Too much = injuries and exhaustion. Let's find the sweet spot.",
      content: `Too little exercise = behavior problems and weight gain. Too much = injuries and exhaustion. Let's find the sweet spot.

## Dogs: It Depends on Breed and Age

**High-Energy Breeds:**
Border Collies, Huskies, Australian Shepherds, Jack Russells, Retrievers (when young).
- **Need:** 1-2 hours of vigorous exercise daily
- **Best activities:** Running, hiking, agility, fetch, swimming

**Medium-Energy Breeds:**
Most mixed breeds, Beagles, Cocker Spaniels, Bulldogs (young).
- **Need:** 30-60 minutes daily
- **Best activities:** Walks, moderate play, dog parks

**Low-Energy Breeds:**
Bulldogs, Basset Hounds, Great Danes, Shih Tzus, senior dogs.
- **Need:** 20-30 minutes daily
- **Best activities:** Short walks, gentle play, sniffing

## Puppies: Less Than You Think

**Rule of thumb:** 5 minutes per month of age, twice daily.
- 3-month-old puppy = 15 minutes, twice a day
- 6-month-old puppy = 30 minutes, twice a day

**Why?** Their bones are still growing. Over-exercise can cause permanent joint damage.

**Avoid:**
- Long runs
- Repetitive jumping
- Stairs (until at least 6 months)

## Cats: Indoor Hunters

Cats need 20-30 minutes of active play daily, but in short bursts.

**Best activities:**
- Wand toys (10-15 min sessions)
- Laser pointers (always end with a catchable toy)
- Treat puzzles
- Climbing (cat trees, shelves)

**Don't:**
- Expect cats to self-exercise (they won't)
- Only use catnip (it's not exercise)

## Senior Pets: Keep Moving

Exercise is crucial for senior pets, but adjust for:
- Arthritis or joint pain
- Less stamina
- Need for rest

**Tips:**
- Shorter, more frequent sessions
- Swimming (low-impact)
- Gentle walks on soft surfaces
- Mental exercise counts more

## Signs You're Doing It Right

- Calm behavior indoors
- Healthy weight (ribs felt but not seen)
- Good sleep
- No destructive behavior
- Happy, engaged demeanor

## Signs of Not Enough Exercise

- Hyperactivity or can't settle
- Destructive behavior (chewing, digging)
- Excessive barking or meowing
- Weight gain
- Escape attempts

## Signs of Too Much Exercise

- Excessive fatigue
- Limping or soreness
- Won't get up for walks
- Loss of appetite
- Injuries

## Weather Considerations

**Hot Weather (>80°F):**
- Exercise early morning or late evening
- Test pavement with your hand (5 seconds rule - if you can't hold your hand there, too hot for paws)
- Bring water
- Watch for excessive panting, drooling, weakness

**Cold Weather (<40°F):**
- Shorter sessions
- Booties or paw protection
- Sweaters for small/short-haired dogs
- Watch for shivering, lifting paws

Remember: A tired pet is a happy pet, but there's a balance. Start slow and build up, especially with new activities.`
    },
    {
      id: 7,
      title: "Socializing Your Pet: Why It Matters",
      category: "Training",
      icon: Users,
      tags: ["socialization", "training", "behavior"],
      difficulty: "Beginner",
      readTime: "5 min",
      summary: "Proper socialization prevents fear, anxiety, and aggression. Here's how to do it right.",
      content: `Socialization isn't just about other animals. It's about everything - people, places, sounds, surfaces, experiences.

## Why It's Critical

**Properly socialized pets:**
- Are confident and relaxed
- Don't fear new experiences
- Are easier to train
- Can go more places with you
- Are less likely to develop anxiety or aggression

**Under-socialized pets:**
- Fear strangers, other animals, or new places
- May become aggressive out of fear
- Have limited life experiences
- Are harder to manage

## The Critical Windows

**Puppies: 3-14 weeks old**
This is THE most important time. Their brain is like a sponge. Positive experiences now last a lifetime.

**Kittens: 2-7 weeks old**
Even shorter window! This is why kittens adopted at 8-12 weeks should already have some socialization.

**After the window closes:**
You can still socialize older pets, but it takes longer and may never be as effective.

## What to Socialize To

**People:**
- Different ages (kids, teens, adults, elderly)
- Different appearances (hats, glasses, uniforms, wheelchairs)
- Different voices and movements

**Animals:**
- Other dogs (various sizes and breeds)
- Cats
- Small animals (if safe)

**Places:**
- Pet stores
- Vet office (happy visits with just treats!)
- Parks
- Friends' homes
- Car rides

**Sounds:**
- Vacuum, doorbell, thunder (start with recordings at low volume)
- Traffic, sirens
- Children playing
- Other animals

**Handling:**
- Touching paws, ears, mouth
- Grooming tools
- Nail trimming
- Vet examination simulation

**Surfaces:**
- Grass, concrete, gravel, sand
- Stairs, bridges
- Metal grates
- Tile, carpet

## How to Do It Right

**Rule #1: Keep it positive**
Every new experience should be paired with something good (treats, praise, play).

**Rule #2: Go at their pace**
Never force interaction. Let them approach new things when ready.

**Rule #3: Watch for stress**
If they show fear (hiding, trembling, trying to escape), you've gone too fast. Back up.

**Rule #4: Short and sweet**
Multiple brief exposures work better than one long session.

## Common Mistakes

**Flooding:**
Overwhelming them with too much too fast (like taking a scared dog to a crowded dog park). This makes fear worse, not better.

**Forcing interaction:**
"Just let the kid pet him" when your dog is scared creates bad associations.

**Skipping socialization:**
"They'll be fine, they're just a house pet." No. Even house pets need socialization.

**Bad first experiences:**
One traumatic encounter can undo weeks of work. Be careful who/what you expose them to.

## Adult Pet Socialization

Can you socialize an adult pet? Yes, but:
- It takes much longer
- They may never be fully comfortable
- You need to go very slowly
- Professional help is often needed

For fearful or aggressive adults, consult a certified behaviorist before attempting socialization.

## Puppy/Kitten Classes

Great for socialization! Look for:
- Small class sizes (6-8 max)
- Positive reinforcement only
- Clean environment
- Vaccination requirements
- Supervised play

Avoid classes that use punishment or allow bullying.

## Quick Checklist

By 16 weeks, aim to expose puppies to:
- 100+ different people
- 50+ different dogs (safe interactions only)
- 20+ different places
- All common household sounds
- Various surfaces and obstacles

Sounds like a lot? It is. But it's worth it for a confident, well-adjusted pet.`
    },
    {
      id: 8,
      title: "Understanding Cat Purring",
      category: "Cat Behavior",
      icon: Cat,
      tags: ["purring", "communication", "cats"],
      difficulty: "Intermediate",
      readTime: "3 min",
      summary: "Purring doesn't always mean happiness. Here's what your cat is really saying.",
      content: `Cats purr when happy, but also when scared, in pain, or dying. Context is everything.

## Why Do Cats Purr?

The honest answer? We're not 100% sure. But we know it serves multiple purposes.

**The leading theories:**
- Communication with kittens (and you)
- Self-soothing when stressed or injured
- Healing mechanism (the frequency may promote bone/tissue healing)
- Contentment and bonding

## Types of Purring

**Happy Purr:**
- Soft, steady rhythm
- Relaxed body
- Slow blinks
- Kneading paws
- **What to do:** Keep doing whatever you're doing

**Stress Purr:**
- Same sound, but body is tense
- At the vet, when injured, or scared
- **What it means:** Self-soothing, like humans humming when nervous
- **What to do:** Reduce stressors, give space

**Solicitation Purr:**
- Higher pitched
- More urgent
- Often mixed with meowing
- **What it means:** "Feed me" or "I want something"
- **Why:** The frequency mimics a baby crying (cats are smart)

## How to Tell the Difference

Look at their body language, not just the purr:

**Happy purring:**
- Relaxed muscles
- Soft eyes
- Upright tail
- Seeking contact

**Stressed purring:**
- Tense body
- Dilated pupils
- Ears back
- Trying to hide or escape

## The Healing Theory

Research shows purring at 25-150 Hz may:
- Strengthen bones
- Heal tissues
- Reduce pain and swelling
- Help breathing

This might explain why cats purr when injured. They're literally trying to heal themselves.

## When to Worry

**Normal:**
- Purring during pets, meals, or sleep
- Varies in volume (some cats purr loud, some barely audible)
- Starts and stops naturally

**Concerning:**
- Suddenly stops purring completely
- Purring sounds different (labored or raspy)
- Purring while clearly in pain or distress
- Excessive, constant purring with other symptoms

If purring comes with labored breathing, lethargy, or other symptoms, see a vet.

## Fun Facts

- Not all cats purr (big cats like lions roar instead)
- Some cats purr so quietly you can only feel it
- Cats can purr while breathing in AND out
- Your cat's purr is good for YOUR health too (lowers stress and blood pressure)

Bottom line: Purring is complex. Don't assume it always means "happy" - read the room (and the cat).`
    },
    {
      id: 9,
      title: "Pet Nutrition Basics",
      category: "Nutrition",
      icon: Utensils,
      tags: ["nutrition", "diet", "feeding"],
      difficulty: "Intermediate",
      readTime: "6 min",
      summary: "Good nutrition is the foundation of health. Here's what actually matters.",
      content: `Pet food marketing is confusing. Let's cut through it.

## Dogs: Omnivores

Dogs can digest both meat and plants. They need:
- **Protein:** 18-25% minimum (from named meat sources)
- **Fat:** 5-15% (for energy and coat health)
- **Carbs:** Digestible sources like sweet potatoes, rice
- **Vitamins & minerals:** Should be in complete foods

**Look for:**
- Named protein as first ingredient ("chicken" not "poultry meal")
- AAFCO certification ("complete and balanced")
- Appropriate for life stage (puppy, adult, senior)

**Avoid:**
- Unnamed proteins ("meat meal")
- Corn/wheat as primary ingredients (fillers)
- Artificial colors (Red 40, etc.)
- BHA, BHT, or ethoxyquin (preservatives)

## Cats: Obligate Carnivores

Cats MUST eat meat. They can't thrive on plant-based diets.

**They need:**
- **High protein:** 26% minimum (30-45% ideal), from ANIMAL sources
- **Taurine:** Essential amino acid (only in animal tissue)
- **Moisture:** Wet food is better than dry
- **Fat:** For energy and vitamins

**Look for:**
- Meat as first ingredient
- High protein percentage
- Taurine listed in ingredients
- Wet food or combination of wet/dry

**Avoid:**
- Plant-based proteins as main ingredient
- Low moisture (only dry food)
- Dog food (lacks taurine - can cause heart disease)

## Wet vs. Dry Food

**Wet Food:**
- ✅ High moisture (good for hydration, especially cats)
- ✅ Usually higher protein
- ✅ Better for picky eaters
- ❌ More expensive
- ❌ Spoils quickly

**Dry Food:**
- ✅ Convenient
- ✅ Cheaper
- ✅ Better for teeth (minimal benefit)
- ❌ Low moisture (can cause dehydration in cats)
- ❌ Often higher in carbs

**Best approach:** Combination of both

## How Much to Feed

**Don't just follow the bag!** Those amounts are guidelines for average pets.

**Adjust based on:**
- Body condition (can you feel ribs easily but not see them?)
- Activity level
- Age
- Individual metabolism

**Feeding schedule:**
- **Dogs:** 2 meals daily (better than free-feeding)
- **Cats:** 2-3 meals (many prefer grazing)
- **Puppies/kittens:** 3-4 meals until 6 months

## Treats: The 10% Rule

Treats should be less than 10% of daily calories. Factor them in!

**Healthy treats:**
- Small pieces of cooked chicken, turkey, or fish
- Baby carrots or green beans (dogs)
- Freeze-dried meat
- Dental chews

**Avoid:**
- Table scraps (usually)
- Anything fatty or salty
- Treats as main calorie source

## Toxic Foods (Never Feed!)

**Fatal to dogs AND cats:**
- Chocolate (all kinds)
- Grapes and raisins
- Onions and garlic
- Xylitol (artificial sweetener in gum, peanut butter)
- Alcohol
- Caffeine
- Cooked bones (splinter risk)
- Avocado
- Macadamia nuts

**Cats specifically:**
- Dairy (most cats are lactose intolerant)
- Raw fish (thiamine deficiency)

## Switching Foods

Don't do it suddenly! Transition over 7-10 days:
- Days 1-2: 75% old, 25% new
- Days 3-4: 50/50
- Days 5-6: 25% old, 75% new
- Day 7+: 100% new

## Signs of Good Nutrition

- Healthy weight
- Shiny coat
- Good energy
- Solid poops
- Bright eyes
- Good breath (not perfect, but not horrible)

## Signs of Poor Nutrition

- Dull, dry coat
- Low energy or hyperactivity
- Obesity or too thin
- Constant itching
- Frequent digestive issues
- Bad breath

## When to Consider Special Diets

**Prescription diets** for:
- Kidney disease
- Urinary issues
- Food allergies
- Digestive problems
- Weight management

**Only feed prescription diets if your vet recommends them.** Don't DIY medical diets.

## Supplements

Most pets on complete, balanced diets don't need supplements. Exceptions:
- Joint support (glucosamine for older pets)
- Omega-3 fatty acids (fish oil)
- Probiotics (after antibiotics or for digestive issues)

**Always ask your vet before adding supplements.** More isn't better and can cause imbalances.

Bottom line: Read labels, focus on quality protein, maintain healthy weight, and consult your vet for individual needs.`
    },
    {
      id: 10,
      title: "Pet-Proofing Your Home",
      category: "Safety",
      icon: Home,
      tags: ["safety", "prevention", "home"],
      difficulty: "Beginner",
      readTime: "5 min",
      summary: "Your home is full of hidden dangers for pets. Here's how to make it safe.",
      content: `Think of pet-proofing like baby-proofing, but your baby has teeth and can jump really high.

## The Biggest Dangers

**1. Toxic Foods**

Fatal to both dogs and cats:
- Chocolate (all types)
- Grapes/raisins
- Onions/garlic
- Xylitol (in gum, some peanut butter, "sugar-free" products)
- Alcohol

**Keep them:**
- In closed pantries/cabinets
- Off counters (especially with cats)
- Out of trash (use lidded bins)

**2. Medications**

Human medications can be fatal to pets. Even one pill.

Most dangerous:
- Ibuprofen (Advil, Motrin)
- Acetaminophen (Tylenol)
- Antidepressants
- ADHD medications

**Keep them:**
- In locked cabinets
- Never on nightstands or counters
- In original bottles (child-proof caps)

**3. Toxic Plants**

**Extremely dangerous:**
- **Lilies** (DEADLY to cats - even pollen)
- Sago palm
- Oleander
- Azaleas

**Moderately toxic:**
- Pothos
- Philodendron
- Aloe vera
- English ivy

**Safe alternatives:**
- Spider plants
- Boston ferns
- African violets
- Cat grass (grow it for them!)

**4. Cleaning Products**

Most are toxic if ingested or inhaled.

**Keep them:**
- In locked cabinets
- Never on the floor
- Away from pets while cleaning

**Use:**
- Pet-safe cleaners
- Vinegar and water
- Baking soda

**5. Electrical Cords**

Especially dangerous for puppies and kittens who chew.

**Solutions:**
- Cord covers
- Bitter apple spray
- Hide cords behind furniture
- Unplug when not in use

## Room-by-Room Safety

**Kitchen:**
- Trash can with lid
- Food in closed containers
- No chocolate, grapes, onions accessible
- Stove knobs turned off
- Sharp objects put away

**Bathroom:**
- Toilet lid DOWN (cats can drown, dogs drink chemicals)
- Medications locked up
- Cleaning products secured
- Razor blades disposed properly
- Hair ties/floss in trash (choking hazards)

**Bedroom:**
- No medications on nightstand
- Laundry off floor (socks are common choking hazards)
- Jewelry secured (can be swallowed)
- Essential oils put away (toxic to cats)

**Living Room:**
- Toxic plants removed
- Cords secured
- Small objects picked up
- Candles out of reach
- Fireplace screen up

**Garage/Shed:**
- Antifreeze LOCKED AWAY (tastes sweet, is fatal)
- Rodent poison secured (can poison your pet)
- Paint/chemicals up high
- Tools put away
- Keep pets out entirely if possible

## Choking Hazards

Common items that cause choking:
- Small toys or toy parts
- Bones (especially cooked - they splinter)
- Rawhide chews (can get stuck)
- Hair ties and rubber bands
- Bottle caps
- Coins
- Batteries (also toxic!)

**Rule:** If it fits entirely in their mouth, it's a choking hazard.

## Other Dangers

**Windows & Balconies:**
- Install screens
- Don't leave windows open unsupervised
- Cats can fall from "safe" heights (high-rise syndrome)

**Strings & Ribbons:**
- Cats LOVE them
- Can cause intestinal blockages requiring surgery
- Includes: dental floss, tinsel, yarn, thread

**Small Spaces:**
- Check washer/dryer before starting (cats nap in them)
- Close recliners carefully
- Block access to tight spaces

**Water Hazards:**
- Cover pools when not in use
- Supervise around hot tubs
- Don't leave bath water unattended
- Empty buckets immediately

## Emergency Preparedness

**Keep on hand:**
- Vet's phone number
- 24-hour emergency vet info
- Pet poison control: (888) 426-4435
- Basic first aid kit
- Pet carrier

**Know the signs of poisoning:**
- Vomiting or diarrhea
- Drooling
- Difficulty breathing
- Seizures
- Weakness or collapse
- Unusual behavior

**If you suspect poisoning:**
1. Call your vet or poison control IMMEDIATELY
2. Bring the product/plant with you
3. Don't induce vomiting unless told to
4. Get to the vet ASAP

## Quick Checklist

- ☐ Toxic foods secured
- ☐ Medications locked up
- ☐ Toxic plants removed
- ☐ Cleaning products locked
- ☐ Electrical cords covered
- ☐ Trash cans have lids
- ☐ Toilet lids down
- ☐ Small objects picked up
- ☐ Garage/shed secured

Pet-proofing isn't one-and-done. As your pet grows and explores, reassess regularly. Better safe than sorry.`
    },
    {
      id: 11,
      title: "Dealing with Separation Anxiety",
      category: "Dog Behavior",
      icon: Heart,
      tags: ["anxiety", "separation", "behavior"],
      difficulty: "Intermediate",
      readTime: "5 min",
      summary: "True separation anxiety is panic, not misbehavior. Here's how to recognize and treat it.",
      content: `If your dog destroys your house only when you leave, they might have separation anxiety. This is a real panic disorder, not spite.

## What Is Separation Anxiety?

It's genuine panic when separated from you. Your dog isn't being "bad" - they're experiencing something like a human panic attack.

Affects 20-40% of dogs, especially:
- Rescue dogs
- Dogs who experienced trauma
- Dogs with sudden schedule changes
- Velcro breeds (very attached)

## True Separation Anxiety vs. Other Issues

**NOT separation anxiety:**
- ❌ Destruction when you're home too
- ❌ Only happens occasionally
- ❌ They're just bored
- ❌ Poor house training

**True separation anxiety:**
- ✅ ONLY happens when you leave
- ✅ Starts within minutes of departure
- ✅ Happens every time
- ✅ Focused at exit points (doors, windows)

## Signs Your Dog Has It

**Before you leave:**
- Following you everywhere
- Panting, pacing, whining
- Trying to prevent you from leaving

**While you're gone:**
- Destructive behavior (focused at doors/windows)
- Non-stop barking or howling
- Accidents (even if housetrained)
- Escape attempts (sometimes injuring themselves)
- Drooling, vomiting

**When you return:**
- Over-the-top greeting (beyond normal excitement)
- Symptoms immediately stop

## What NOT to Do

**Don't punish them.** They can't control it. Punishment makes anxiety worse.

**Don't get another pet "for company."** Often makes it worse.

**Don't use a crate if they panic in it.** They can hurt themselves trying to escape.

**Don't make departures/arrivals a big deal.** Keep them calm and low-key.

## What TO Do

**1. Exercise before leaving**
A tired dog is calmer. 30-60 minutes of physical activity before you leave.

**2. Desensitize to departure cues**
Practice picking up keys, putting on shoes, etc. without leaving. Break the association.

**3. Practice short departures**
- Start with 10 seconds
- Gradually increase to 30 seconds, 1 minute, 2 minutes, etc.
- ONLY increase if they stay calm
- This can take weeks or months

**4. Create a safe space**
- Comfortable bed or crate (if they like it)
- Calming music or TV
- Toys they only get when you leave
- Pheromone diffuser (Adaptil)

**5. Mental exhaustion**
Puzzle feeders, training sessions before leaving. Mental work tires them out.

**6. Stay calm during departures**
No long goodbyes. Just leave quietly.

## Tools That Can Help

**Calming aids:**
- Pheromone diffusers
- Anxiety wraps (Thundershirt)
- CBD treats (vet-approved)
- Calming music

**Technology:**
- Pet cameras (see what triggers them)
- Automatic treat dispensers
- Interactive toys

## When to Get Professional Help

Separation anxiety is hard to fix alone. Consider professional help if:
- It's severe (self-injury, extreme destruction)
- Not improving after 2-3 weeks
- You feel overwhelmed
- Need to leave them for work

**Get help from:**
- Your vet (rule out medical issues first)
- Certified dog trainer (CPDT-KA)
- Veterinary behaviorist (DACVB)

## Medication

For severe cases, anti-anxiety medication combined with training works best.

**Common medications:**
- Fluoxetine (Prozac)
- Clomipramine
- Trazodone (short-term)

**Important:**
- Must be prescribed by vet
- Takes 4-6 weeks to work
- Not a cure, but makes training possible
- Always combine with behavior modification

## Realistic Timeline

- **Mild cases:** 4-8 weeks
- **Moderate cases:** 2-4 months
- **Severe cases:** 6-12+ months

Progress isn't linear. Setbacks are normal. Don't give up.

## Prevention (for puppies/new dogs)

- Practice being alone from day one
- Don't allow constant following
- Vary your routine
- Build independence early
- Make alone time positive (special treats/toys)

Remember: Your dog isn't trying to punish you. They're genuinely terrified. With patience and the right approach, most dogs improve significantly.`
    },
    {
      id: 12,
      title: "Solving Litter Box Problems",
      category: "Cat Behavior",
      icon: Home,
      tags: ["litter box", "cats", "behavior"],
      difficulty: "Intermediate",
      readTime: "5 min",
      summary: "Litter box issues are the #1 reason cats end up in shelters. Most are solvable if you know what to do.",
      content: `A cat not using their litter box is telling you something is wrong. It's rarely spite.

## Rule Out Medical Issues FIRST

**See a vet immediately if:**
- Sudden change (they were fine before)
- Straining to urinate
- Blood in urine
- Crying while using box
- Going more frequently than usual

**Common medical causes:**
- UTI (urinary tract infection)
- Bladder stones
- Kidney disease
- Diabetes
- Arthritis (box is painful to enter)

**Important:** Cats can die from urinary blockage in 24-48 hours. Never assume it's just behavioral.

## Common Behavioral Causes

**1. Not enough boxes**

**The rule:** Number of cats + 1

- 1 cat = 2 boxes
- 2 cats = 3 boxes
- 3 cats = 4 boxes

Why? Cats like options and won't use a dirty box.

**2. Wrong location**

**Bad locations:**
- Near loud appliances (washer/dryer)
- Near food/water
- Hard to access (senior cats especially)
- Too public or too isolated

**Good locations:**
- Quiet but accessible
- Multiple floors if you have stairs
- Easy to get in and out
- Private but not scary

**3. Box type**

**Most cats prefer:**
- Large, uncovered boxes
- Low sides (especially seniors)
- 1.5x their body length

**Many cats hate:**
- Covered boxes (trap odor, feel unsafe)
- Small boxes
- Boxes with high sides (if senior/young)

**4. Wrong litter**

**Most cats prefer:**
- Unscented
- Clumping
- Fine texture (like sand)

**Try to avoid:**
- Scented litters (overwhelming to cats)
- Crystals or pellets
- Suddenly changing brands

**5. Not clean enough**

**Minimum:**
- Scoop 1-2 times daily
- Fully change litter weekly
- Wash box with soap monthly
- Replace box yearly (plastic absorbs odor)

**Signs box is too dirty:**
- Cat perches on edge
- Quick in and out
- Going right next to box

**6. Stress**

**Common stressors:**
- New pet or person
- Moving or renovations
- Schedule changes
- Another cat bullying them
- Outdoor cats they can see

## Solutions Step-by-Step

**Step 1: Vet check**
Rule out medical issues.

**Step 2: Add more boxes**
Remember the formula: # cats + 1

**Step 3: Try different litter**
Set up 3 boxes with different litters. See which they prefer.

**Step 4: Fix locations**
Move boxes to better spots. Multiple locations.

**Step 5: Remove covers**
If boxes are covered, take the tops off.

**Step 6: Clean accidents properly**
Use enzyme cleaners (Nature's Miracle, etc.). Regular cleaners don't remove the scent.

**Step 7: Reduce stress**
- Feliway diffuser (cat pheromones)
- More resources (food, water, perches)
- Separate problem cats if bullying

## Spraying vs. Urinating

**Spraying (marking):**
- Standing position
- Vertical surfaces (walls)
- Small amounts
- Tail quivers

**Urinating:**
- Squatting position
- Horizontal surfaces (floor)
- Larger amounts

**For spraying:**
- Spay/neuter (stops 90% of spraying)
- Block views of outdoor cats
- Feliway diffusers
- Clean marked spots with enzyme cleaner

## Quick Fixes to Try

**If they suddenly stop using the box:**

1. Add 2-3 more boxes immediately
2. Try unscented, clumping litter
3. Move boxes to different locations
4. Remove any covers
5. Scoop more frequently
6. Make sure no cat is guarding the boxes

## When to Get Professional Help

If you've tried everything and it's not improving after 2-3 weeks, consult:
- Your vet (for medical issues)
- Certified cat behaviorist
- Veterinary behaviorist (DACVB)

## What NOT to Do

**Never:**
- Punish them (makes it worse)
- Rub their nose in it (cruel and doesn't work)
- Put them in the box and hold them there
- Assume they're doing it out of spite
- Give up without trying everything

## Success Timeline

- Week 1-2: May get worse before better
- Week 2-4: Should see some improvement
- Month 2-3: Most cases resolved

Be patient. Litter box problems are frustrating but almost always fixable.

Remember: Your cat isn't being bad. They're trying to tell you something is wrong. Listen to them.`
    },
    {
      id: 13,
      title: "Introducing a New Pet to Your Home",
      category: "Training",
      icon: Home,
      tags: ["introduction", "new pet", "multi-pet"],
      difficulty: "Intermediate",
      readTime: "6 min",
      summary: "First impressions matter. Here's how to introduce a new pet without causing chaos.",
      content: `Bringing home a new pet is exciting, but rushing introductions can create problems that last for years.

## Before Bringing Them Home

**Prepare the space:**
- Set up a separate room for the new pet (especially cats)
- Get duplicate resources (food bowls, beds, toys)
- Install baby gates if needed
- Have all supplies ready

**What you'll need:**
- Food and water bowls (separate from existing pets')
- Bed or crate
- Toys
- Collar/harness and leash
- ID tag
- First aid kit

## Dog-to-Dog Introductions

**Step 1: Neutral territory first**
Meet at a park or neutral location, not your home. Your existing dog may feel territorial at home.

**How to do it:**
- Both dogs on leash
- Walk parallel to each other (not face-to-face)
- Keep distance at first (20-30 feet)
- Gradually decrease distance if both are calm
- Watch for stress signals

**Step 2: Walk home together**
If the neutral meeting went well, walk home together. This builds positive association.

**Step 3: Home introduction**
- Remove toys, food bowls, and high-value items first
- Let them explore together in a neutral room (not the existing dog's favorite spot)
- Keep leashes on but loose
- Supervise closely

**First few days:**
- Keep interactions short and positive
- Separate during meals
- Separate when unsupervised
- Give each dog individual attention
- Watch for resource guarding

## Cat-to-Cat Introductions

Cats need a MUCH slower introduction than dogs. Rushing it can create enemies for life.

**Step 1: Complete separation (3-7 days)**
- New cat in separate room with own litter box, food, water
- They can smell each other under the door
- Feed them on opposite sides of the door

**Step 2: Scent swapping (3-5 days)**
- Rub towel on one cat, let other cat smell it
- Swap their bedding
- Switch their rooms so they explore each other's territory

**Step 3: Visual contact (3-7 days)**
- Use a baby gate or crack the door
- They can see each other but not interact
- Feed on opposite sides of the gate
- Keep sessions short

**Step 4: Supervised interaction**
- Open the door but supervise closely
- Keep sessions brief (10-15 minutes)
- Gradually increase duration
- Always provide escape routes

**Timeline:** Full integration can take 2-4 weeks or longer. Don't rush it.

## Dog-to-Cat Introductions

This is the riskiest combination. Take it very slowly.

**Prep work:**
- Train your dog on basic commands (sit, stay, leave it)
- Practice calm behavior around cat smells/sounds
- Make sure cat has high escape routes

**Step 1: Separate living (1-2 weeks)**
- Complete separation with scent swapping
- Dog learns cat is part of the household

**Step 2: Visual introduction**
- Dog on leash, behind baby gate
- Cat free to approach or leave
- Reward dog for calm behavior
- Keep sessions very short

**Step 3: Controlled interaction**
- Dog on leash
- Cat has escape routes
- Reward dog for ignoring cat
- Stop if dog gets too excited

**Never:**
- Leave them unsupervised until you're 100% confident
- Force the cat to interact
- Allow chasing (even if it seems "playful")
- Punish the dog for being interested

## Signs It's Going Well

**Dogs:**
- Play bows
- Relaxed body language
- Taking breaks from play
- Respecting each other's space

**Cats:**
- Slow blinks
- Eating normally
- Using litter box normally
- Approaching each other calmly

## Warning Signs

**Stop the introduction if you see:**
- Stiff body language
- Growling or hissing (beyond initial warnings)
- Raised hackles
- Stalking behavior
- One pet is always hiding
- Loss of appetite
- Litter box issues (cats)

## Common Mistakes

**Moving too fast**
The #1 mistake. Slow is better than sorry.

**Forcing interaction**
Let them set the pace.

**Not providing enough resources**
Multiple food bowls, water stations, toys, beds, litter boxes.

**Expecting immediate friendship**
They might just tolerate each other, and that's okay.

**Neglecting the existing pet**
Don't let your current pet feel replaced.

## When to Get Help

Call a professional if:
- Aggression escalates
- One pet is terrified
- No improvement after 4-6 weeks
- You feel overwhelmed

## Special Cases

**Puppies/Kittens:**
Usually easier! They're more adaptable. But still supervise closely.

**Senior pets:**
May need extra patience. They might be set in their ways.

**Rescue animals:**
May have unknown history with other animals. Go even slower.

## Success Tips

- **Patience is key:** Some pets bond in days, others take months
- **Keep routines:** Existing pet needs consistency
- **Individual attention:** Each pet needs one-on-one time with you
- **Positive associations:** Treats and praise during interactions
- **Safe spaces:** Each pet needs a place to escape

Remember: The goal isn't necessarily best friends. Peaceful coexistence is a win!`
    },
    {
      id: 14,
      title: "Understanding Pet Sleep Patterns",
      category: "Physical Health",
      icon: Activity,
      tags: ["sleep", "health", "behavior"],
      difficulty: "Beginner",
      readTime: "4 min",
      summary: "How much sleep is normal? Learn what's healthy and when to worry.",
      content: `Pets sleep A LOT. But how much is normal, and when should you be concerned?

## Dogs: Champion Sleepers

**Average sleep: 12-14 hours per day**

But it varies by:
- Age (puppies and seniors sleep more)
- Size (larger dogs sleep more)
- Activity level
- Health status

**Puppies (8-12 weeks):**
- Sleep 18-20 hours per day
- Short bursts of intense energy, then crash
- Need lots of sleep for growth and development

**Adult dogs:**
- 12-14 hours per day
- Mix of deep sleep and light napping
- High-energy breeds may sleep less (10-12 hours)
- Low-energy breeds may sleep more (14-16 hours)

**Senior dogs:**
- 16-18 hours per day
- Sleep more deeply
- May have disrupted nighttime sleep

## Cats: Professional Nappers

**Average sleep: 12-16 hours per day**

Some cats sleep up to 20 hours! They're crepuscular (most active at dawn/dusk).

**Kittens:**
- Sleep 20+ hours per day
- Growing requires tons of energy

**Adult cats:**
- 12-16 hours per day
- 75% is light dozing, 25% is deep sleep
- 15-minute power naps are normal

**Senior cats:**
- 16-20 hours per day
- Sleep more soundly
- May vocalize at night (check with vet)

## Sleep Stages

**Light sleep/Dozing:**
- Eyes may be partially open
- Ears twitch at sounds
- Easy to wake
- This is most of your pet's "sleep"

**Deep sleep/REM:**
- Completely relaxed
- Twitching, paddling paws, dreaming
- Harder to wake
- Only lasts a few minutes at a time

## Normal Sleep Behaviors

**Dogs:**
- Circling before lying down (denning instinct)
- Twitching/paddling while dreaming
- Snoring (some breeds)
- Changing positions frequently

**Cats:**
- Finding warm, enclosed spaces
- Sleeping in funny positions
- Twitching whiskers and paws
- Purring while sleeping

## When to Worry

**Sleeping too much:**
- Sudden increase in sleep
- Difficult to wake
- No interest in play or food
- Lethargy when awake

**Could indicate:** Illness, pain, depression, thyroid issues, diabetes

**Sleeping too little:**
- Restlessness
- Pacing at night
- Can't settle
- Constant interruptions to sleep

**Could indicate:** Anxiety, pain, cognitive decline, thyroid issues

## Creating Good Sleep Habits

**For dogs:**
- Consistent bedtime routine
- Comfortable bed in quiet area
- Exercise during the day
- Last potty break before bed
- Consider crate training for puppies

**For cats:**
- Play session before bedtime (tires them out)
- Feed right before bed (post-meal nap)
- Comfortable beds in multiple locations
- Dim lights in the evening
- Keep litter box accessible

## Sleep Disruptions

**Common causes:**
- Pain or discomfort
- Full bladder
- Hunger
- Anxiety or stress
- Noise or light
- Temperature (too hot/cold)
- Age-related cognitive issues

**Solutions:**
- Vet check for pain/illness
- Adjust feeding schedule
- Add nightlight
- White noise machine
- Comfortable temperature
- More daytime exercise

## Age-Related Changes

**Senior pets often:**
- Sleep more overall
- Sleep less deeply at night
- Wake up confused
- Pace or vocalize at night

This can be cognitive dysfunction (similar to dementia). Talk to your vet about:
- Medication options
- Environmental modifications
- Routine adjustments

## Red Flags - See a Vet

**Immediate concerns:**
- Can't wake them
- Breathing is labored
- Sudden collapse
- Loss of consciousness

**Schedule a visit if:**
- Dramatic change in sleep patterns
- Excessive sleeping plus other symptoms (loss of appetite, lethargy)
- Sleep disruption lasting more than a few days
- Nighttime pacing/confusion in senior pets
- Seems in pain when getting up

## Tips for Better Sleep

**Dogs:**
- Tire them out: "A tired dog is a good dog"
- Mental stimulation counts as exercise
- Consistent schedule
- Comfortable sleeping area
- Consider calming music or white noise

**Cats:**
- Play before bed (hunt-eat-groom-sleep cycle)
- Don't reward nighttime antics
- Keep routine consistent
- Provide engaging daytime activities
- Multiple sleeping spots (they like options)

## Bottom Line

Pets sleep a lot, and that's normal! As long as they:
- Wake up alert and interested in food/play
- Have no other concerning symptoms
- Sleep peacefully without distress
- Maintain their normal energy when awake

...then they're probably fine. Trust your instincts, and when in doubt, call your vet.`
    },
    {
      id: 15,
      title: "First Aid Basics for Pet Owners",
      category: "Health",
      icon: Stethoscope,
      tags: ["first aid", "emergency", "health"],
      difficulty: "Intermediate",
      readTime: "7 min",
      summary: "Every pet owner should know basic first aid. Here's what to do in common emergencies.",
      content: `This isn't a substitute for veterinary care, but knowing what to do in the first minutes can save your pet's life.

## Pet First Aid Kit

**Must-haves:**
- Vet's phone number and emergency vet number
- Pet poison control: (888) 426-4435
- Gauze pads and rolls
- Medical tape
- Tweezers
- Scissors
- Digital thermometer
- Hydrogen peroxide 3% (for inducing vomiting - only if vet tells you to)
- Saline solution
- Disposable gloves
- Towels
- Muzzle (even friendly pets may bite when in pain)
- Pet first aid guide

## Choking

**Signs:**
- Pawing at mouth
- Gagging, coughing
- Blue or pale gums
- Difficulty breathing
- Panic

**What to do:**
1. Open mouth and look for object
2. If you can see it and it's easy to remove, carefully pull it out with fingers or tweezers
3. **If you can't reach it or they're unconscious:**
   - **Small dogs:** Hold upside down by hind legs, give 5 sharp blows between shoulder blades
   - **Cats:** Modified Heimlich - hold against your chest with their back to you, make a fist just below ribcage, give 5 quick upward thrusts
   - **Large dogs:** Heimlich maneuver - stand behind, make a fist just below rib cage, give quick upward thrusts
4. Rush to vet even if object comes out

**Don't:**
- Blindly reach into their throat (you could push it further down)
- Panic (stay calm so they stay calm)

## Bleeding

**Signs:**
- Blood (obviously)
- Pale gums
- Weakness
- Rapid breathing

**What to do:**
1. Apply direct pressure with clean cloth/gauze
2. Hold for 5-10 minutes without looking (peeking disrupts clotting)
3. If blood soaks through, add more gauze on top (don't remove the first layer)
4. Bandage firmly but not too tight
5. Get to vet immediately

**For severe bleeding:**
- Elevate the wound above heart if possible
- Apply continuous pressure
- Don't use a tourniquet unless absolutely life-threatening

## Poisoning

**Signs:**
- Vomiting or diarrhea
- Drooling
- Seizures
- Lethargy or weakness
- Loss of coordination
- Difficulty breathing

**What to do:**
1. **Call pet poison control or vet IMMEDIATELY:** (888) 426-4435
2. Have the product/substance with you when you call
3. **Do NOT induce vomiting unless specifically told to** (some substances cause more damage coming back up)
4. Follow their instructions exactly
5. Get to vet ASAP

**Common household poisons:**
- Chocolate
- Xylitol (sugar-free products)
- Grapes/raisins
- Onions/garlic
- Medications (human or pet)
- Antifreeze
- Rat poison
- Essential oils (especially toxic to cats)

## Heatstroke

**Signs:**
- Heavy panting
- Drooling
- Red or pale gums
- Vomiting
- Diarrhea
- Loss of consciousness
- Body temperature above 104°F (normal is 101-102.5°F)

**What to do:**
1. Move to cool area immediately
2. Offer small amounts of cool (not ice cold) water
3. Apply cool (not cold) wet towels to neck, armpits, groin
4. Run cool water over body (not ice water - too cold can be dangerous)
5. Use fan if available
6. **Get to vet immediately** - even if they seem to recover, internal damage can occur

**Don't:**
- Use ice or ice-cold water (can cause shock)
- Force them to drink
- Leave them alone

## Seizures

**Signs:**
- Uncontrolled muscle movements
- Loss of consciousness
- Drooling, foaming
- Loss of bowel/bladder control
- Paddling legs
- May last 30 seconds to several minutes

**What to do:**
1. Stay calm
2. **Don't put anything in their mouth** (they can't swallow their tongue)
3. Clear area of dangerous objects
4. Time the seizure (write it down)
5. Keep them calm and quiet after it stops
6. Call vet immediately

**EMERGENCY if:**
- Seizure lasts more than 5 minutes
- Multiple seizures within 24 hours
- They don't regain consciousness between seizures

## Fractures

**Signs:**
- Not bearing weight on limb
- Limb at unusual angle
- Swelling
- Pain when touched
- Bone protruding (open fracture)

**What to do:**
1. Keep them still and calm
2. **Don't try to set the bone yourself**
3. If transporting:
   - Use a board or flat surface
   - Minimize movement
   - Support the injury
4. Muzzle if necessary (pain makes pets bite)
5. Get to vet immediately

## Burns

**Signs:**
- Red, blistered skin
- Hair loss in area
- Pain
- Open wounds

**What to do:**
1. Run cool water over burn for 10 minutes
2. Apply cool compress
3. **Don't apply ice** (can damage tissue further)
4. **Don't apply butter, oils, or ointments**
5. Cover with clean, damp cloth
6. Get to vet

## CPR Basics

**Only perform if no heartbeat and not breathing**

**Check for breathing/pulse first:**
- Feel for heartbeat on left side of chest
- Watch for chest movement
- Feel for breath from nose

**For dogs:**
1. Lay on right side
2. If no breathing or pulse:
   - Close mouth, breathe into nose (1 breath every 4-5 seconds)
   - Chest compressions: 30 compressions, then 2 breaths
   - Compress 1/3 to 1/2 depth of chest
   - 100-120 compressions per minute
   - Continue until you reach the vet

**For cats:**
- Same technique but gentler
- Can do compressions with one hand
- Be careful not to compress too hard (smaller ribcage)

**Get to vet while performing CPR if possible**

## When to Go to the Vet

**Immediate emergencies:**
- Difficulty breathing
- Unconsciousness
- Severe bleeding
- Seizures (especially > 5 min)
- Suspected poisoning
- Heatstroke
- Choking
- Severe trauma
- Bloated, hard abdomen (especially dogs - can indicate bloat/GDV)
- Inability to urinate (especially male cats - can be fatal within 24-48 hours)
- Pale or blue gums

**Same-day visit:**
- Vomiting/diarrhea lasting > 24 hours
- Not eating for 24+ hours (12 hours for cats)
- Lethargy
- Limping
- Eye issues
- Persistent coughing

## Prevention Tips

- Keep human medications out of reach
- No toxic foods accessible
- Secure trash cans
- Check yard for toxic plants
- Supervise around water
- Never leave in hot cars
- Use pet-safe cleaning products
- Keep first aid kit stocked and accessible

## Most Important Rule

**When in doubt, call your vet.** It's always better to check and have it be nothing than to wait and have it be something serious.

Save these numbers in your phone:
- Regular vet
- Emergency vet
- Pet poison control: (888) 426-4435 (ASPCA Animal Poison Control Center)

Consider taking a pet first aid class through Red Cross or your local vet!`
    },
    {
      id: 16,
      title: "Leash Training Your Puppy",
      category: "Training",
      icon: PawPrint,
      tags: ["leash training", "puppy", "walking", "obedience"],
      difficulty: "Beginner",
      readTime: "4 min",
      summary: "Start leash training early for a well-behaved walking companion. Here's how.",
      content: `Leash training isn't just about walks; it's about safety and control. Start early and make it positive!

## Getting Started: The Right Gear

**Collar or Harness?**
- **Flat collar:** Good for ID tags, but can put pressure on the neck if pulling.
- **Harness:** Distributes pressure across the chest, ideal for puppies or dogs prone to tracheal issues. Front-clip harnesses discourage pulling.
- **Leash:** 4-6 foot standard leash is best. Avoid retractable leashes for training as they teach pulling.

**Introduction to the Collar/Harness:**
1. Put it on for short periods while distracting with treats or play.
2. Gradually increase wear time.
3. Don't leave it on unsupervised initially.

## First Steps with the Leash Indoors

**Make it positive:**
1. Attach the leash to the collar/harness.
2. Let your puppy drag it around under supervision for a few minutes.
3. Keep it super short, just 5-10 minutes. Distract with play and treats.
4. Pick up the leash before they get frustrated.

**Teaching pressure and release:**
1. With the leash on, stand a few feet away.
2. Gently apply slight pressure on the leash while saying "Come!" or "Let's go!".
3. As soon as your puppy takes a step towards you, release pressure and reward with a high-value treat and praise.
4. Repeat this many times. The goal is for them to learn that releasing the pressure by moving towards you gets them a reward.

## Moving Outdoors

**Keep it short and sweet:**
1. Start in a low-distraction area like your backyard.
2. Follow the same positive reinforcement techniques as indoors.
3. If they pull, stop moving. Only proceed when the leash is loose. This teaches them that pulling doesn't get them where they want to go.

**Dealing with pulling:**
- **Stop-and-go:** Every time they pull, stop. Start walking again when the leash is loose. Be consistent!
- **Change direction:** If they pull, change direction. This forces them to pay attention to you.
- **Treat lure:** Hold a treat near your thigh to keep them close in a "heel" position. Reward frequently.

## The "Heel" Command

The "heel" command teaches your dog to walk politely beside you.

1.  **Start in a quiet area:** With your dog on a short leash.
2.  **Lure with a treat:** Hold a high-value treat in your hand at your side, near your dog's nose.
3.  **Say "Heel" and step forward:** As your dog follows the treat at your side, take a few steps.
4.  **Reward and praise:** When they walk nicely beside you for a few steps, stop, give the treat, and praise enthusiastically.
5.  **Gradually increase duration:** Over time, extend the number of steps they walk in heel before receiving a reward.

## Important Tips

-   **Consistency is key:** Everyone in the household should use the same commands and techniques.
-   **Positive reinforcement:** Always reward good behavior with treats, praise, and play.
-   **Be patient:** Puppies have short attention spans. Keep sessions brief (5-10 minutes).
-   **Avoid punishment:** Never yank the leash or scold your puppy. This can create fear and resentment.
-   **Socialization:** Expose your puppy to different environments, sounds, and people during walks once they're comfortable on a leash.
-   **Watch for stress signals:** Yawning, lip-licking, pulling away are signs they might be overwhelmed.

## When to Seek Professional Help

If you're struggling with leash training, or if your dog is exhibiting excessive fear or aggression on walks, don't hesitate to consult a certified professional dog trainer. They can provide personalized guidance and support.

Remember, a well-behaved dog on a leash makes walks enjoyable for both of you! Enjoy the journey!`
    },
    {
      id: 17,
      title: "Why Does My Cat Scratch Furniture?",
      category: "Cat Behavior",
      icon: Cat,
      tags: ["scratching", "behavior", "cats", "furniture"],
      difficulty: "Beginner",
      readTime: "3 min",
      summary: "Cats scratch for several natural reasons. Understanding why can help you redirect the behavior.",
      content: `Your cat isn't scratching your couch out of spite! It's a natural, necessary behavior for them.

## Why Cats Scratch

**1. Nail Maintenance:**
- Scratching removes the dead outer layers of their claws, revealing sharp, new ones. It's like a manicure for them.

**2. Stretching and Exercise:**
- It allows them to stretch their body and paws, working muscles from nose to tail.

**3. Scent Marking:**
- Cats have scent glands in their paws. When they scratch, they're leaving their unique scent (and visual marks) to mark their territory. It's their way of saying, "I was here!"

**4. Visual Marking:**
- The shredded material itself is a visual signpost to other cats (and you) of their presence.

**5. Stress Relief/Emotional Outlet:**
- Scratching can be a way for cats to relieve stress, express excitement, or get attention.

## How to Redirect Scratching

The key is to provide acceptable alternatives and make the undesirable spots less appealing.

**1. Provide Appropriate Scratching Posts:**
- **Variety is key:** Offer different materials (sisal rope, cardboard, carpet, wood) and different orientations (vertical posts, horizontal pads, ramps).
- **Sturdy and Tall:** Vertical posts should be tall enough for your cat to fully extend their body when scratching (at least 28-36 inches). It should also be stable and not wobble.
- **Location, Location, Location:** Place posts in areas your cat already likes to scratch (e.g., near the couch) and near where they sleep (they often like to scratch after waking up). Have multiple posts in different rooms.

**2. Make Undesirable Surfaces Unattractive:**
- **Texture deterrents:** Cover scratched furniture with double-sided sticky tape (e.g., Sticky Paws), aluminum foil, or a plastic mat (like an office chair mat with nubs facing up). Cats don't like the feel.
- **Odor deterrents:** Spray citrus-scented or cat-repellent sprays (pet-safe ones only!) on the furniture.
- **Blocking access:** Temporarily block access to the scratched area with furniture or pet gates if possible.

**3. Encourage Use of Scratching Posts:**
- **Positive reinforcement:** Praise and give treats when your cat uses the scratching post.
- **Catnip:** Rub catnip on the post to make it more appealing.
- **Interactive play:** Lead your cat to the post during play sessions, letting them "catch" a toy on the post itself.

## Other Considerations

**Nail Trims:**
- Regularly trimming your cat's nails can help reduce the damage, but it won't stop the natural need to scratch. It's part of a good grooming routine.

**Soft Paws/Nail Caps:**
- These are vinyl caps glued onto your cat's claws. They need to be replaced every 4-6 weeks. They prevent damage but allow the cat to still perform the scratching motion. This is a temporary solution or for cases where other methods fail.

**Declawing:**
- Declawing is a surgical amputation of the last bone of each toe. It's painful, can lead to long-term behavioral and physical problems, and is banned in many places. It should always be a last resort and only considered if the cat's quality of life or safety is severely compromised, and all other solutions have been exhausted, in consultation with a vet.

## Common Mistakes

- **Not providing enough options:** One small, flimsy scratching post isn't enough.
- **Placing posts in isolated areas:** Cats scratch where they spend time.
- **Punishing your cat:** Scolding or spraying your cat will only make them scared of you and may lead to them scratching when you're not around.

With patience and the right tools, you can successfully redirect your cat's scratching habits to appropriate surfaces, saving your furniture and keeping your feline friend happy!`
    },
    {
      id: 18,
      title: "Understanding Pet Insurance: Is It Worth It?",
      category: "Finance",
      icon: PiggyBank,
      tags: ["pet insurance", "costs", "health", "finance"],
      difficulty: "Intermediate",
      readTime: "5 min",
      summary: "Pet insurance can ease the burden of vet bills, but is it right for every pet owner?",
      content: `The cost of veterinary care can be substantial, especially in emergencies. Pet insurance aims to make these costs more manageable, but it's essential to understand how it works.

## How Pet Insurance Works

Pet insurance typically works on a reimbursement model:
1. You pay your vet bill upfront.
2. You submit a claim to your insurance provider.
3. The insurance provider reimburses you a percentage of the covered costs, after your deductible has been met.

## What Does Pet Insurance Cover?

Coverage varies widely by plan and provider, but generally includes:

**Accident-Only Plans:**
- Covers injuries from accidents (e.g., broken bones, car accidents, ingesting foreign objects).
- Most affordable but limited coverage.

**Accident & Illness Plans (Most Popular):**
- Covers accidents (as above).
- Covers illnesses (e.g., infections, cancer, diabetes, arthritis, allergies).
- May include emergency care, surgery, hospitalization, diagnostics (X-rays, blood tests), and prescription medications.

**Wellness/Routine Care Add-ons:**
- Covers preventative care (e.g., annual exams, vaccinations, flea/tick prevention, dental cleanings).
- Often an additional cost and can be purchased separately or added to an A&I plan.

**What's NOT typically covered:**
- **Pre-existing conditions:** Conditions diagnosed or treated before coverage begins or during a waiting period. This is crucial to understand.
- **Elective procedures:** Cosmetic surgery (e.g., ear cropping, tail docking), anal sac expression, nail trims.
- **Grooming:** Baths, de-shedding.
- **Breeding/pregnancy costs.**
- **Cloning.**

## Key Terms to Understand

- **Deductible:** The amount you must pay out-of-pocket before your insurance begins to reimburse you. Can be annual or per-incident.
- **Reimbursement Level:** The percentage of covered veterinary expenses that the insurance company will pay (e.g., 70%, 80%, 90%).
- **Annual Limit:** The maximum amount the insurance company will pay out in a policy year. Some plans offer unlimited coverage.
- **Waiting Period:** The time between purchasing a policy and when coverage for certain conditions begins. There are often different waiting periods for accidents and illnesses.
- **Co-pay:** A fixed amount you pay for a covered service, similar to human health insurance (less common in pet insurance).

## Pros of Pet Insurance

- **Financial Peace of Mind:** Helps cover unexpected high vet bills for accidents or serious illnesses.
- **Better Medical Decisions:** Allows you to prioritize your pet's health without financial constraints.
- **Customizable Plans:** Many options to fit different budgets and needs.
- **Access to Specialists:** Can make specialized care (e.g., oncology, cardiology) more accessible.

## Cons of Pet Insurance

- **Monthly Premiums:** A recurring cost, regardless of whether you file a claim.
- **No Coverage for Pre-existing Conditions:** This is a major limitation, especially for older pets or those with chronic issues.
- **Reimbursement Model:** You typically pay upfront and wait for reimbursement, which might be a strain for some.
- **Not a Savings Account:** If your pet remains healthy, you might pay more in premiums than you receive in benefits.
- **Policy Changes:** Premiums can increase as your pet ages or if they develop chronic conditions.

## Is It Right for You?

Consider these factors:
- **Your pet's age and breed:** Younger pets and those without pre-existing conditions will get the best coverage and lower premiums. Certain breeds are predisposed to genetic conditions.
- **Your financial situation:** Do you have an emergency fund for your pet? If not, insurance might be a good option.
- **Your risk tolerance:** Are you willing to self-insure (set aside money monthly) or prefer the predictability of a premium?
- **Cost of vet care in your area:** Vet costs vary geographically.

## Alternatives to Pet Insurance

- **Pet Emergency Fund:** Open a separate savings account and contribute to it monthly.
- **CareCredit:** A credit card specifically for healthcare expenses, often with promotional no-interest periods.
- **Financial Aid Programs:** Non-profits like The Pet Fund or RedRover offer assistance for owners who cannot afford emergency veterinary care.

## How to Choose a Plan

1. **Compare multiple providers:** Get quotes from at least 3-4 reputable companies.
2. **Read the fine print:** Understand deductibles, reimbursement levels, annual limits, waiting periods, and exclusions (especially pre-existing conditions).
3. **Check customer reviews:** Look for companies with good customer service and easy claims processing.
4. **Consider your pet's needs:** Tailor the plan to their age, breed, and lifestyle.

Ultimately, the decision to get pet insurance depends on your individual circumstances. Research thoroughly and make the choice that provides you the most comfort and security for your beloved companion.`
    },
    {
      id: 19,
      title: "Traveling with Your Pet: Tips for a Smooth Trip",
      category: "Safety",
      icon: Briefcase,
      tags: ["travel", "safety", "vacation", "pet friendly"],
      difficulty: "Intermediate",
      readTime: "6 min",
      summary: "Planning a trip with your furry friend? Here's how to ensure a safe and enjoyable journey.",
      content: `Traveling with pets can be a wonderful experience, but it requires careful planning to keep everyone happy and safe.

## Before You Go

**1. Vet Check-up:**
- Schedule a check-up to ensure your pet is healthy enough for travel.
- Discuss any anxiety medications if your pet is prone to stress.
- Get updated vaccinations and health certificates, especially for air travel or international trips.

**2. Identification:**
- Ensure your pet wears a collar with up-to-date ID tags.
- Microchip your pet and register your contact information.
- Consider a temporary tag with your destination phone number.

**3. Research Pet-Friendly Options:**
- **Accommodation:** Book pet-friendly hotels, rentals, or campsites well in advance. Confirm their specific pet policies (size limits, fees, designated areas).
- **Transportation:**
    - **Car:** Plan frequent potty breaks, pack water, and secure your pet.
    - **Air:** Research airline policies immediately. Many require specific carriers, health certificates, and may have breed or temperature restrictions. Consider if flying is truly safe and necessary for your pet.
    - **Train/Bus:** Very few allow pets beyond service animals.
- **Activities:** Look for pet-friendly parks, trails, beaches, and restaurants with outdoor seating.

**4. Pack a Pet Travel Kit:**
- Food and water (and bowls)
- Medications (with prescriptions)
- Leash, collar, and extra ID tags
- Waste bags
- Favorite toys and blanket (for comfort)
- First-aid kit (for pets)
- Recent photo of your pet (in case they get lost)
- Travel carrier/crate
- Copy of health records/vaccination certificates

**5. Practice Runs:**
- If your pet isn't used to car rides or their carrier, do short practice runs to get them accustomed.

## Car Travel Tips

**1. Safety First:**
- **Secure your pet:** Use a crash-tested crate, a pet safety harness and seatbelt, or a car seat. This protects them (and you) in an accident and prevents distractions.
- **Never let them ride with their head out the window:** Debris can injure their eyes or ears.

**2. Hydration and Breaks:**
- Offer water frequently.
- Stop every 2-4 hours for potty breaks and a chance to stretch their legs. Always keep them on a leash.

**3. Temperature Control:**
- Maintain a comfortable temperature in the car.
- **NEVER leave your pet alone in a parked car.** Temperatures can rise to deadly levels very quickly, even on mild days.

**4. Motion Sickness:**
- Avoid feeding a large meal right before traveling.
- Speak to your vet about anti-nausea medication if your pet is prone to motion sickness.

## Air Travel Tips

**1. Understand the Risks:**
- Air travel can be stressful and dangerous for some pets, especially brachycephalic (short-nosed) breeds. Consider if it's truly necessary.

**2. In-Cabin vs. Cargo:**
- **In-cabin:** Small pets (who fit under the seat in an approved carrier) can often travel with you. This is generally safer.
- **Cargo:** Larger pets may travel in the cargo hold. This has more risks, including temperature extremes, noise, and handler error.
- **Direct flights are safer.**

**3. Carrier Requirements:**
- Must be airline-approved, well-ventilated, and large enough for your pet to stand, turn around, and lie down comfortably.

**4. Sedation:**
- Most vets advise against sedating pets for air travel, as it can cause respiratory and cardiovascular problems at high altitudes. Consult your vet.

## During Your Trip

- **Maintain Routine:** Try to stick to your pet's usual feeding and walking schedule as much as possible.
- **Supervision:** Always supervise your pet, especially in unfamiliar environments.
- **Leash Laws:** Adhere to all local leash laws and pet regulations.
- **Clean Up:** Always pick up after your pet.
- **Be Prepared for Emergencies:** Know the location of the nearest emergency vet clinic at your destination.

## After Your Trip

- Allow your pet time to decompress and get used to being home again.
- Watch for any signs of illness or stress, and consult your vet if you have concerns.

Traveling with your pet can create lasting memories. With thoughtful preparation and prioritizing their safety and comfort, you can ensure a successful adventure for both of you!`
    },
    {
      id: 20,
      title: "Grooming Your Pet at Home: A Basic Guide",
      category: "Health",
      icon: Ruler,
      tags: ["grooming", "hygiene", "coat care", "nails", "ears", "teeth"],
      difficulty: "Beginner",
      readTime: "5 min",
      summary: "Regular home grooming keeps your pet healthy and happy, and strengthens your bond.",
      content: `Home grooming is more than just aesthetics; it's vital for your pet's health, comfort, and can be a wonderful bonding experience.

## Brushing: The Foundation

**Why it's important:**
- Prevents mats and tangles
- Removes loose fur, reducing shedding
- Distributes natural oils for a healthy, shiny coat
- Allows you to check for skin issues, parasites, or lumps

**Tools:**
- **Slicker brush:** Good for most coat types, removes loose fur and tangles.
- **Pin brush:** For longer, silky coats, to gently detangle.
- **Bristle brush:** For short, smooth coats, to add shine.
- **Undercoat rake/de-shedding tool:** For double-coated breeds, to remove dense undercoat.
- **Grooming mitt:** For very short-haired pets, to remove loose hair and massage.

**Technique:**
- Start with short, gentle sessions, especially for puppies/kittens.
- Brush in the direction of hair growth.
- Pay attention to areas prone to matting (behind ears, armpits, tail).
- Reward with treats and praise.

**Frequency:**
- Daily for long-haired or prone-to-matting breeds.
- 2-3 times a week for most other breeds.
- Weekly for short-haired breeds.

## Bathing: Not Too Often

**Why it's important:**
- Removes dirt, odors, and allergens.
- Helps manage skin conditions.

**Tools & Supplies:**
- Pet-specific shampoo (human shampoo can irritate skin).
- Conditioner (optional, for longer coats).
- Cotton balls (to protect ears).
- Towels.
- Non-slip mat for the tub.

**Technique:**
- Brush before bathing to remove loose fur and tangles.
- Use lukewarm water.
- Wet thoroughly, apply shampoo, lather, and rinse completely (residue can cause skin irritation).
- Place cotton balls in ears to prevent water entry (remove afterwards).
- Dry thoroughly with towels. For dogs, a pet-specific low-heat dryer can speed up drying for thick coats.

**Frequency:**
- Generally, every 4-6 weeks for most dogs.
- Cats rarely need full baths unless they're very dirty or have mobility issues.

## Nail Trimming: Crucial for Comfort

**Why it's important:**
- Overgrown nails can cause pain, difficulty walking, infections, and even deformities.
- Reduces risk of nails getting snagged and tearing.

**Tools:**
- **Guillotine or scissor-style clippers:** Choose based on pet size and personal preference.
- **Styptic powder:** To stop bleeding if you cut too short (the "quick").

**Technique:**
- Hold paw firmly.
- Identify the quick (the pink part containing nerves and blood vessels). If nails are dark, only trim the very tip.
- Cut at a 45-degree angle, just before the quick.
- Reward lavishly after each paw.

**Frequency:**
- Every 2-4 weeks, depending on growth and activity level. If you hear their nails clicking on the floor, it's time for a trim.

## Ear Cleaning: Prevent Infections

**Why it's important:**
- Removes wax, dirt, and debris that can lead to ear infections.

**Tools & Supplies:**
- Pet-specific ear cleaning solution (NEVER use rubbing alcohol or hydrogen peroxide).
- Cotton balls or gauze pads.

**Technique:**
- Lift ear flap.
- Squirt a small amount of cleaner into the ear canal.
- Gently massage the base of the ear for 30 seconds.
- Let your pet shake their head.
- Use a cotton ball/gauze to wipe away debris from the outer ear (never insert anything deep into the ear canal).

**Frequency:**
- Weekly or bi-weekly for breeds prone to ear infections (e.g., floppy ears).
- Monthly for most others.

## Dental Care: Often Overlooked

**Why it's important:**
- Prevents plaque and tartar buildup, leading to gum disease, pain, and even organ damage.

**Tools & Supplies:**
- Pet-specific toothbrush (finger brush or regular pet brush).
- Pet-specific toothpaste (NEVER use human toothpaste – it's toxic).

**Technique:**
- Start slowly, letting them lick toothpaste off your finger.
- Gradually introduce the brush, focusing on outer surfaces of teeth.
- Lift the lip and brush in small circles.

**Frequency:**
- Daily is ideal, but even a few times a week makes a difference.
- Regular professional dental cleanings by a vet are also crucial.

## General Tips for Home Grooming

- **Start young:** Acclimate puppies and kittens early.
- **Short, positive sessions:** End before they get anxious or impatient.
- **Consistency:** Make it a regular part of their routine.
- **Positive reinforcement:** Treats, praise, and gentle handling.
- **Watch for signs of discomfort:** Stop if they're stressed.
- **Seek professional help:** If you're uncomfortable or unable to perform a task, a professional groomer or vet can help.

A well-groomed pet is a happier, healthier pet, and the time you spend grooming is an investment in your relationship.`
    },
    {
      id: 21,
      title: "Understanding Pet Vaccinations",
      category: "Health",
      icon: Syringe,
      tags: ["vaccinations", "preventative care", "health", "diseases"],
      difficulty: "Beginner",
      readTime: "4 min",
      summary: "Vaccinations protect your pet from serious and often fatal diseases. Here's what you need to know.",
      content: `Vaccinations are a cornerstone of preventative pet care, safeguarding your furry companions from a host of dangerous and potentially deadly diseases.

## How Vaccinations Work

Vaccines introduce a weakened or inactive form of a virus or bacteria (or parts of it) into your pet's system. This stimulates their immune system to produce antibodies and memory cells without causing the actual disease. If your pet is later exposed to the real pathogen, their immune system will be ready to fight it off.

## Core vs. Non-Core Vaccines

Veterinarians categorize vaccines as "core" or "non-core" based on the severity of the disease, the risk of exposure, and the vaccine's efficacy.

**Core Vaccines (Highly Recommended for All Pets):**

**For Dogs:**
1.  **Rabies:** Required by law in most areas. A fatal neurological disease transmissible to humans.
2.  **Distemper (CDV):** A severe, highly contagious viral disease affecting the respiratory, gastrointestinal, and nervous systems.
3.  **Adenovirus (Canine Hepatitis - CAV-1 & CAV-2):** Affects the liver and can cause respiratory disease.
4.  **Parvovirus (CPV):** A highly contagious and often fatal gastrointestinal disease, especially in puppies.
    *   *These are often combined into a single DAPP or DHPP vaccine.*

**For Cats:**
1.  **Rabies:** Also often legally required.
2.  **Feline Panleukopenia (FPV):** Also known as feline distemper, a highly contagious and severe viral disease affecting blood cells and the GI tract.
3.  **Feline Herpesvirus (FHV-1):** A common cause of upper respiratory infections (cat flu).
4.  **Feline Calicivirus (FCV):** Another common cause of upper respiratory infections and oral disease.
    *   *These are often combined into a single FVRCP vaccine.*

**Non-Core Vaccines (Recommended Based on Lifestyle and Risk Factors):**

**For Dogs:**
-   **Bordetella (Kennel Cough):** Recommended for dogs that socialize with other dogs (dog parks, boarding, grooming, daycare).
-   **Leptospirosis:** Recommended for dogs with exposure to wildlife, stagnant water, or rural areas. It's zoonotic (can spread to humans).
-   **Lyme Disease:** Recommended for dogs in high-risk areas with tick exposure.
-   **Canine Influenza (Dog Flu):** Recommended for dogs with high exposure to other dogs (similar to Bordetella).

**For Cats:**
-   **Feline Leukemia Virus (FeLV):** Highly recommended for all kittens and cats who go outdoors or live with FeLV-positive cats. Causes immune suppression and various cancers.
-   **Chlamydia felis:** For cats at risk of conjunctivitis in multi-cat households.
-   **Feline Immunodeficiency Virus (FIV):** Not as commonly used due to various factors, discussion with your vet is key.

## Vaccination Schedule

**Puppies and Kittens:**
-   Receive a series of vaccinations, usually starting at 6-8 weeks of age and given every 3-4 weeks until they are 16 weeks old. This is because maternal antibodies can interfere with vaccine effectiveness, so multiple doses ensure immunity is established.
-   Rabies is typically given as a single dose around 12-16 weeks.

**Adult Pets:**
-   Require booster vaccinations periodically (e.g., every 1 or 3 years) to maintain protective immunity. Your vet will recommend a schedule tailored to your pet.

## Risks and Side Effects

Vaccines are generally safe, but like any medical procedure, they carry a small risk of side effects:

**Mild and Temporary:**
-   Soreness or swelling at the injection site.
-   Mild fever.
-   Temporary lethargy or decreased appetite.
-   These usually resolve within 24-48 hours.

**Rare, More Serious Reactions:**
-   Allergic reactions (facial swelling, hives, vomiting, diarrhea, difficulty breathing) - usually occur within minutes to hours. **Seek immediate veterinary attention.**
-   Injection site sarcomas (a type of tumor) in cats - extremely rare, typically associated with FeLV and Rabies vaccines, which are now often given in specific locations on the limb to facilitate surgical removal if necessary.

## Importance of Regular Vet Visits

Vaccinations are just one part of preventative care. Regular wellness exams are crucial for:
-   Assessing your pet's overall health.
-   Discussing appropriate vaccine protocols based on their lifestyle.
-   Detecting and addressing health issues early.
-   Maintaining parasite prevention.

## Final Thoughts

Vaccinations are a small investment that can provide huge protection against costly, painful, and potentially fatal diseases. Always consult your veterinarian to create a personalized vaccination plan for your pet, ensuring they receive the best possible protection based on their individual risk factors and lifestyle.`
    },
    {
      id: 22,
      title: "Dealing with Excessive Barking in Dogs",
      category: "Dog Behavior",
      icon: MessageCircle,
      tags: ["barking", "dog behavior", "training", "nuisance"],
      difficulty: "Intermediate",
      readTime: "5 min",
      summary: "Excessive barking can be frustrating, but understanding why your dog barks is the first step to managing it.",
      content: `Barking is a natural form of communication for dogs, but when it becomes excessive, it can be a nuisance for both you and your neighbors. Understanding the root cause is crucial for effective management.

## Why Do Dogs Bark?

Dogs bark for a variety of reasons, and the type of bark can sometimes give clues:

1.  **Alert/Alarm Barking:** "Someone's at the door!" "There's a squirrel!" Often triggered by sights or sounds. This is usually sharp, repetitive.
2.  **Attention-Seeking Barking:** "Play with me!" "Feed me!" "Pet me!" Often accompanied by other attention-seeking behaviors.
3.  **Boredom/Frustration Barking:** "I have nothing to do!" "I'm lonely!" Often continuous and monotonous, sometimes with destructive behavior.
4.  **Anxiety/Fear Barking:** "I'm scared!" "I'm anxious!" Can be high-pitched, whiny, or frantic. Common with separation anxiety or fear of specific stimuli.
5.  **Greeting Barking:** "Hello! I'm so excited!" Usually accompanied by tail wags, jumping, and loose body language.
6.  **Play Barking:** "Chase me!" "Let's wrestle!" Often sounds playful, sometimes mixed with growls or yips.
7.  **Territorial Barking:** "Get off my property!" Often loud, deep, and persistent, directed at strangers near their perceived territory.

## How to Manage Excessive Barking

The strategy depends entirely on the reason for the barking.

### 1. Identify the Cause

Observe *when* and *why* your dog barks.
- What triggers it? (Mailman, other dogs, being alone, you looking at them?)
- What does the bark sound like?
- What else are they doing when they bark?

### 2. Address the Root Cause

**For Alert/Territorial Barking (Windows, Fences):**
-   **Reduce visibility:** Block views with frosted window film, curtains, or privacy fences.
-   **Desensitization & Counter-conditioning:** Gradually expose them to the trigger at a low intensity while rewarding calm behavior.
-   **"Quiet" command:** Teach a "quiet" command (see below).

**For Attention-Seeking Barking:**
-   **Ignore the barking:** This is tough but vital. Turn your back, walk away, or leave the room. Only reward when they are quiet.
-   **Reward calm behavior:** Proactively reward them for being quiet *before* they start barking for attention.
-   **Provide alternative ways to get attention:** Teach them to sit politely for attention, or bring you a toy.

**For Boredom/Frustration Barking:**
-   **Increase physical exercise:** A tired dog is a quiet dog. Ensure daily walks, runs, or play sessions.
-   **Increase mental stimulation:** Puzzle toys, KONGs, chew toys, training sessions, and scent games can all help.
-   **Rotate toys:** Keep toys interesting by rotating them.
-   **Dog daycare:** Consider daycare if they spend long hours alone.

**For Anxiety/Fear Barking (e.g., Separation Anxiety, Thunderstorms):**
-   **Identify and address the specific anxiety:** This often requires a multi-faceted approach.
-   **Consult a vet or certified behaviorist:** For severe cases, medication combined with behavior modification may be necessary.
-   **Create a safe space:** A crate or quiet room.
-   **Calming aids:** Pheromones, thundershirts, calming music.

**For Greeting Barking:**
-   **"Sit" and "Stay" command:** Practice having them sit and stay when people approach. Reward for quiet greetings.
-   **Management:** Keep them on a leash when greeting guests, or put them in another room until they calm down.

## Training a "Quiet" Command

This is a valuable tool for all types of barking.

1.  **Trigger barking:** (e.g., knock on the door, ring doorbell).
2.  **Let them bark a few times.**
3.  **Say "Quiet!"**
4.  **Distract them with a high-value treat:** Hold it to their nose. The moment they stop barking to sniff the treat, praise them ("Yes! Quiet!") and give the treat.
5.  **Gradually increase duration:** Once they reliably stop barking for the treat, hold the treat longer before giving it, extending the "quiet" time.
6.  **Practice frequently.**

## What NOT to Do

-   **Don't yell at your dog:** This can reinforce the barking (they think you're barking with them) or make them fearful.
-   **Don't reward barking (even unintentionally):** Giving attention, treats, or letting them out while they are barking teaches them that barking works.
-   **Don't use shock collars or harsh deterrents:** These can cause fear, anxiety, and aggression, often making the problem worse in the long run.

## When to Seek Professional Help

If you've tried various methods consistently for several weeks and see no improvement, or if the barking is accompanied by aggression, destruction, or self-harm, it's time to consult:
-   Your veterinarian (to rule out medical causes).
-   A Certified Professional Dog Trainer (CPDT-KA).
-   A Veterinary Behaviorist (DACVB).

Managing excessive barking takes patience, consistency, and a deep understanding of your dog's motivations. With the right approach, you can restore peace and quiet to your home.`
    }
  ];

  const filteredContent = content.filter(item => {
    const matchesSearch = searchTerm === "" ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(content.map(item => item.category))];

  const categoryIcons = {
    "Dog Behavior": Dog,
    "Cat Behavior": Cat,
    "Mental Health": Brain,
    "Enrichment": Sparkles,
    "Health": Stethoscope,
    "Physical Health": Activity,
    "Training": Users,
    "Nutrition": Utensils,
    "Safety": Home,
    "Finance": PiggyBank,
  };

  const handleArticleClick = (article) => {
    const isCurrentlyExpanded = expandedCard === article.id;
    setExpandedCard(isCurrentlyExpanded ? null : article.id); // Toggle expansion
    // Removed analytics tracking
  };

  return (
    <>
      <SEO
        title="Pet Care Library - Expert Guides & Behavioral Insights"
        description="Comprehensive pet care guides covering behavior, health, training, nutrition and more. Expert insights to help you understand and care for your pets better."
        keywords="pet care guides, dog behavior, cat behavior, pet health, pet training, pet nutrition"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Pet Care Library
                </h1>
                <p className="text-gray-600 mt-1">Expert guides and behavioral insights for pet parents</p>
              </div>
            </div>

            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search articles, tips, and guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-purple-200 focus:border-purple-400 bg-white shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-6">
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => {
              const Icon = category === "all" ? BookOpen : categoryIcons[category];
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    : "border-purple-200 hover:border-purple-400 hover:bg-purple-50"
                  }
                >
                  {Icon && <Icon className="w-4 h-4 mr-2" />}
                  {category === "all" ? "All Topics" : category}
                </Button>
              );
            })}
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Showing {filteredContent.length} {filteredContent.length === 1 ? 'article' : 'articles'}
          </p>
        </div>

        <div className="container mx-auto px-6 pb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredContent.map((item, index) => {
                const Icon = item.icon;
                const isExpanded = expandedCard === item.id;
                
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white h-full flex flex-col">
                      <CardHeader className="border-b border-purple-100 pb-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <Badge className="bg-purple-100 text-purple-700 mb-2">
                              {item.category}
                            </Badge>
                            <CardTitle className="text-lg leading-tight">
                              {item.title}
                            </CardTitle>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <Badge variant="outline" className="border-green-300 text-green-700">
                            {item.difficulty}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.readTime}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="p-6 flex-1 flex flex-col">
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {item.summary}
                        </p>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mb-4 overflow-hidden"
                            >
                              <div className="article-content border-t border-gray-100 pt-6">
                                <ReactMarkdown
                                  components={{
                                    // Sanitize links - prevent javascript: urls
                                    a: ({node, ...props}) => {
                                      const href = props.href || '';
                                      if (href.startsWith('javascript:') || href.startsWith('data:')) {
                                        return <span>{props.children}</span>; // Render children but remove dangerous link
                                      }
                                      return <a {...props} target="_blank" rel="noopener noreferrer" />;
                                    },
                                    // Prevent script tags
                                    script: () => null,
                                    // Prevent iframes
                                    iframe: () => null,
                                    // Sanitize images
                                    img: ({node, ...props}) => {
                                      const src = props.src || '';
                                      if (src.startsWith('javascript:') || src.startsWith('data:text/html')) {
                                        return null; // Remove dangerous images
                                      }
                                      return <img {...props} alt={props.alt || ''} />;
                                    },
                                    h2: ({node, ...props}) => (
                                      <h2 className="text-2xl font-bold text-purple-900 mt-8 mb-4 first:mt-0 pb-2 border-b-2 border-purple-200" {...props} />
                                    ),
                                    h3: ({node, ...props}) => (
                                      <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3 flex items-center gap-2" {...props} />
                                    ),
                                    p: ({node, ...props}) => (
                                      <p className="text-gray-700 leading-relaxed mb-4 text-[15px]" {...props} />
                                    ),
                                    ul: ({node, ...props}) => (
                                      <ul className="space-y-3 mb-6 ml-1" {...props} />
                                    ),
                                    ol: ({node, ...props}) => (
                                      <ol className="space-y-3 mb-6 ml-1 list-decimal list-inside" {...props} />
                                    ),
                                    li: ({node, children, ...props}) => (
                                      <li className="flex items-start gap-3 text-gray-700 text-[15px] leading-relaxed" {...props}>
                                        <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                                        <span className="flex-1">{children}</span>
                                      </li>
                                    ),
                                    strong: ({node, ...props}) => (
                                      <strong className="font-bold text-gray-900 bg-yellow-50 px-1 rounded" {...props} />
                                    ),
                                    blockquote: ({node, ...props}) => (
                                      <blockquote className="border-l-4 border-purple-400 pl-4 py-2 my-4 bg-purple-50 rounded-r-lg italic text-gray-700" {...props} />
                                    ),
                                    hr: ({node, ...props}) => (
                                      <hr className="my-8 border-t-2 border-gray-200" {...props} />
                                    )
                                  }}
                                  className="prose prose-purple max-w-none"
                                >
                                  {item.content}
                                </ReactMarkdown>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="mt-auto">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs border-gray-300 text-gray-600 cursor-pointer hover:border-purple-400 hover:text-purple-700 transition-colors"
                                onClick={() => setSearchTerm(tag)}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <Button
                            onClick={() => handleArticleClick(item)}
                            variant="outline"
                            className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold"
                          >
                            {isExpanded ? "Show Less ▲" : "Read Full Guide ▼"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredContent.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-bold mb-2 text-gray-900">No Articles Found</h3>
                  <p className="text-gray-600 mb-4">
                    Try searching with different keywords or browse all categories
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      <style jsx>{`
        .article-content {
          max-height: 600px;
          overflow-y: auto;
          padding-right: 8px; /* For scrollbar */
        }
        
        .article-content::-webkit-scrollbar {
          width: 6px;
        }
        
        .article-content::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .article-content::-webkit-scrollbar-thumb {
          background: #c4b5fd; /* Light purple */
          border-radius: 10px;
        }
        
        .article-content::-webkit-scrollbar-thumb:hover {
          background: #a78bfa; /* Deeper purple */
        }
      `}</style>
    </>
  );
}
