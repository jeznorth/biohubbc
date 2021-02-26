import { IDBConnection } from '../database/db';
import {
  getClimateChangeInitiativeSQL,
  getFirstNationsSQL,
  getFundingSourceSQL,
  getInvestmentActionCategorySQL,
  getManagementActionTypeSQL
} from '../queries/code-queries';
import { getLogger } from '../utils/logger';

const defaultLog = getLogger('queries/code-queries');

export interface IAllCodeSets {
  management_action_type: object;
  climate_change_initiative: object;
  first_nations: object;
  funding_source: object;
  investment_action_category: object;
  project_activity: object;
  project_type: object;
  region: object;
  species: object;
}

/**
 * Function that fetches all code sets.
 *
 * @param {PoolClient} connection
 * @returns {IAllCodeSets} an object containing all code sets
 */
export async function getAllCodeSets(connection: IDBConnection): Promise<IAllCodeSets | null> {
  defaultLog.debug({ message: 'getAllCodeSets' });

  if (!connection) {
    return null;
  }

  await connection.open();

  const [
    management_action_type,
    climate_change_initiative,
    first_nations,
    funding_source,
    investment_action_category
  ] = await Promise.all([
    await connection.query(getManagementActionTypeSQL().text),
    await connection.query(getClimateChangeInitiativeSQL().text),
    await connection.query(getFirstNationsSQL().text),
    await connection.query(getFundingSourceSQL().text),
    await connection.query(getInvestmentActionCategorySQL().text)
  ]);

  await connection.commit();

  connection.release();

  const result: IAllCodeSets = {
    management_action_type: (management_action_type && management_action_type.rows) || [],
    climate_change_initiative: (climate_change_initiative && climate_change_initiative.rows) || [],
    first_nations: (first_nations && first_nations.rows) || [],
    funding_source: (funding_source && funding_source.rows) || [],
    investment_action_category: (investment_action_category && investment_action_category.rows) || [],
    // TODO Temporarily hard coded list of project activities
    project_activity: [
      { id: 1, name: 'Reconnaissance' },
      { id: 2, name: 'Monitoring' },
      { id: 3, name: 'Habitat Restoration & Enhancement' },
      { id: 4, name: 'Habitat Research' },
      { id: 5, name: 'Habitat Protection' },
      { id: 6, name: 'Salvage' },
      { id: 7, name: 'Research' }
    ],
    // TODO Temporarily hard coded list of project types
    project_type: [
      { id: 1, name: 'Fisheries' },
      { id: 2, name: 'Wildlife' },
      { id: 3, name: 'Aquatic Habitat' },
      { id: 4, name: 'Terestrial Habitat' }
    ],
    // TODO Temporarily hard coded list of regions
    region: [
      { id: 1, name: 'West Coast' },
      { id: 2, name: 'South Coast' },
      { id: 3, name: 'Kootenays' },
      { id: 4, name: 'Thompson-Okanagan' },
      { id: 5, name: 'Cariboo' },
      { id: 6, name: 'Skeena' },
      { id: 7, name: 'Omineca' },
      { id: 8, name: 'Northeast' }
    ],
    // TODO Temporarily hard coded list of basic species values for demo purposes
    species: [
      { id: 1, name: 'Acuteleaf Small Limestone Moss [Seligeria acutifolia]' },
      { id: 2, name: 'Alkaline Wing-nerved Moss [Pterygoneurum kozlovii]' },
      { id: 3, name: 'American Badger [Taxidea taxus]' },
      { id: 4, name: 'American Badger jeffersonii subspecies [Taxidea taxus  jeffersonii]' },
      { id: 5, name: 'American Black Bear [Ursus americanus]' },
      { id: 6, name: 'American Coot [Fulica americana]' },
      { id: 7, name: 'American White Pelican [Pelecanus erythrorhynchos]' },
      { id: 8, name: 'Ancient Murrelet [Synthliboramphus antiquus]' },
      { id: 9, name: 'Audouin’s Night-stalking Tiger Beetle [Omus audouini]' },
      { id: 10, name: 'Bald Eagle [Haliaeetus leucocephalus]' },
      { id: 11, name: 'Band-tailed Pigeon [Patagioenas fasciata]' },
      { id: 12, name: 'Banded Cord-moss [Entosthodon fascicularis]' },
      { id: 13, name: 'Bank Swallow [Riparia riparia]' },
      { id: 14, name: 'Barn Owl [Tyto alba]' },
      { id: 15, name: 'Barn Swallow [Hirundo rustica]' },
      { id: 16, name: 'Basking Shark [Cetorhinus maximus]' },
      { id: 17, name: 'Batwing Vinyl Lichen [Leptogium platynum]' },
      { id: 18, name: "Bear's-foot Sanicle [Sanicula arctopoides]" },
      { id: 19, name: 'Bearded Owl-clover [Triphysaria versicolor]' },
      { id: 20, name: "Behr's Hairstreak [Satyrium behrii]" },
      { id: 21, name: 'Bent Spike-rush [Eleocharis geniculata]' },
      { id: 22, name: 'Black Swift [Cypseloides niger]' },
      { id: 23, name: 'Black Tern [Chlidonias niger]' },
      { id: 24, name: 'Blue Shark [Prionace glauca]' },
      { id: 25, name: 'Blue-grey Taildropper [Prophysaon coeruleum]' },
      { id: 26, name: 'Bobolink [Dolichonyx oryzivorus]' },
      { id: 27, name: 'Bog Bird’s-foot Trefoil [Lotus pinnatus]' },
      { id: 28, name: 'Boreal Owl [Aegolius funereus]' },
      { id: 29, name: 'Branched Phacelia [Phacelia ramosissima]' },
      { id: 30, name: 'Brook Spike-primrose [Epilobium torreyi]' },
      { id: 31, name: 'Buff-breasted Sandpiper [Tryngites subruficollis]' },
      { id: 32, name: 'Bull Trout [Salvelinus confluentus]' },
      { id: 33, name: 'Burrowing Owl [Athene cunicularia]' },
      { id: 34, name: 'California Buttercup [Ranunculus californicus]' },
      { id: 35, name: 'California Sea Lion [Zalophus californianus]' },
      { id: 36, name: 'Canada Lynx [Lynx canadensis]' },
      { id: 37, name: 'Canada Warbler [Cardellina canadensis]' },
      { id: 38, name: 'Canyon Wren [Catherpes mexicanus]' },
      { id: 39, name: 'Carey’s Small Limestone Moss [Seligeria careyana]' },
      { id: 40, name: 'Caribou dawsoni subspecies [Rangifer tarandus  dawsoni]' },
      { id: 41, name: 'Caribou [Rangifer tarandus]' },
      { id: 42, name: 'Cascade Mantled Ground Squirrel [Spermophilus saturatus]' },
      { id: 43, name: 'Caspian Tern [Sterna caspia]' },
      { id: 44, name: "Cassin's Auklet [Ptychoramphus aleuticus]" },
      { id: 45, name: 'Chinook Salmon [Oncorhynchus tshawytscha]' },
      { id: 46, name: 'Chiselmouth [Acrocheilus alutaceus]' },
      { id: 47, name: 'Cliff Paintbrush [Castilleja rupicola]' },
      { id: 48, name: 'Coast Manroot [Marah oregana]' },
      { id: 49, name: 'Coast Microseris [Microseris bigelovii]' },
      { id: 50, name: 'Coastal Giant Salamander [Dicamptodon tenebrosus]' },
      { id: 51, name: "Coastal Scouler's Catchfly [Silene scouleri  ssp. grandis]" },
      { id: 52, name: 'Coastal Tailed Frog [Ascaphus truei]' },
      { id: 53, name: 'Coastal Wood Fern [Dryopteris arguta]' },
      { id: 54, name: 'Coastrange Sculpin [Cottus aleuticus]' },
      { id: 55, name: "Coeur d'Alene Salamander [Plethodon idahoensis]" },
      { id: 56, name: 'Coho Salmon [Oncorhynchus kisutch]' },
      { id: 57, name: 'Collared Pika [Ochotona collaris]' },
      { id: 58, name: 'Columbia Dune Moth [Copablepharon absidum]' },
      { id: 59, name: 'Columbia Quillwort [Isoetes minima]' },
      { id: 60, name: 'Columbia Sculpin [Cottus hubbsi]' },
      { id: 61, name: 'Columbia Spotted Frog [Rana luteiventris]' },
      { id: 62, name: 'Columbian Carpet Moss [Bryoerythrophyllum columbianum]' },
      { id: 63, name: 'Common Loon [Gavia immer]' },
      { id: 64, name: 'Common Nighthawk [Chordeiles minor]' },
      { id: 65, name: 'Common Poorwill [Phalaenoptilus nuttallii]' },
      { id: 66, name: 'Contorted-pod Evening-primrose [Camissonia contorta]' },
      { id: 67, name: "Cooper's Hawk [Accipiter cooperii]" },
      { id: 68, name: 'Crumpled Tarpaper Lichen [Collema coniophilum]' },
      { id: 69, name: 'Cryptic Paw Lichen [Nephroma occultum]' },
      { id: 70, name: 'Dalton’s Moss [Daltonia splachnoides]' },
      { id: 71, name: 'Deltoid Balsamroot [Balsamorhiza deltoidea]' },
      { id: 72, name: 'Dense Spike-primrose [Epilobium densiflorum]' },
      { id: 73, name: 'Dense-flowered Lupine [Lupinus densiflorus]' },
      { id: 74, name: 'Desert Nightsnake [Hypsiglena chlorophaea]' },
      { id: 75, name: 'Double-crested Cormorant [Phalacrocorax auritus]' },
      { id: 76, name: 'Dromedary Jumping-slug [Hemphillia dromedarius]' },
      { id: 77, name: 'Drooping-leaved Beard-moss [Oxystegus recurvifolius]' },
      { id: 78, name: 'Dun Skipper vestris subspecies [Euphyes vestris  vestris]' },
      { id: 79, name: 'Dwarf Hesperochiron [Hesperochiron pumilus]' },
      { id: 80, name: 'Dwarf Sandwort [Minuartia pusilla]' },
      { id: 81, name: 'Dwarf Woolly-heads [Psilocarphus brevissimus]' },
      { id: 82, name: "Edwards' Beach Moth [Anarta edwardsii]" },
      { id: 83, name: 'Enos Lake Benthic Threespine Stickleback [Gasterosteus aculeatus]' },
      { id: 84, name: 'Enos Lake Limnetic Threespine Stickleback [Gasterosteus aculeatus]' },
      { id: 85, name: 'Enos Lake Threespine Sticklebacks [Gasterosteus spp.]' },
      { id: 86, name: 'Ensatina [Ensatina eschscholtzii]' },
      { id: 87, name: 'Ermine haidarum subspecies [Mustela erminea  haidarum]' },
      { id: 88, name: 'Eulachon [Thaleichthys pacificus]' },
      { id: 89, name: 'Evening Fieldslug [Deroceras hesperium]' },
      { id: 90, name: 'Evening Grosbeak [Coccothraustes vespertinus]' },
      { id: 91, name: 'Fameflower [Talinum sediforme]' },
      { id: 92, name: 'Flammulated Owl [Otus flammeolus]' },
      { id: 93, name: 'Foothill Sedge [Carex tumulicola]' },
      { id: 94, name: "Forster's Tern [Sterna forsteri]" },
      { id: 95, name: 'Fragrant Popcornflower [Plagiobothrys figuratus]' },
      { id: 96, name: 'Fringed Bat [Myotis thysanodes]' },
      { id: 97, name: 'Frosted Glass-whiskers [Sclerophora peronella]' },
      { id: 98, name: 'Georgia Basin Bog Spider [Gnaphosa snohomish]' },
      { id: 99, name: 'Giant Helleborine [Epipactis gigantea]' },
      { id: 100, name: 'Giant Threespine Stickleback [Gasterosteus aculeatus]' },
      { id: 101, name: 'Golden Eagle [Aquila chrysaetos]' },
      { id: 102, name: 'Golden Paintbrush [Castilleja levisecta]' },
      { id: 103, name: 'Grand Coulee Owl-clover [Orthocarpus barbatus]' },
      { id: 104, name: "Gray's Desert-parsley [Lomatium grayi]" },
      { id: 105, name: 'Great Basin Gophersnake [Pituophis catenifer  deserticola]' },
      { id: 106, name: 'Great Basin Spadefoot [Spea intermontana]' },
      { id: 107, name: 'Great Blue Heron fannini subspecies [Ardea herodias  fannini]' },
      { id: 108, name: 'Great Grey Owl [Strix nebulosa]' },
      { id: 109, name: 'Greater Sage-Grouse phaios subspecies [Centrocercus urophasianus  phaios]' },
      { id: 110, name: 'Green Sturgeon [Acipenser medirostris]' },
      { id: 111, name: 'Grey Flycatcher [Empidonax wrightii]' },
      { id: 112, name: 'Grey Whale [Eschrichtius robustus]' },
      { id: 113, name: 'Grizzly Bear [Ursus arctos]' },
      { id: 114, name: 'Gypsy Cuckoo Bumble Bee [Bombus bohemicus]' },
      { id: 115, name: 'Gyrfalcon [Falco rusticolus]' },
      { id: 116, name: 'Hadley Lake Benthic Threespine Stickleback [Gasterosteus aculeatus]' },
      { id: 117, name: 'Hadley Lake Limnetic Threespine Stickleback [Gasterosteus aculeatus]' },
      { id: 118, name: 'Haida Gwaii Slug [Staala gwaii]' },
      { id: 119, name: 'Hairy Paintbrush [Castilleja tenuis]' },
      { id: 120, name: 'Half-moon Hairstreak [Satyrium semiluna]' },
      { id: 121, name: "Haller's Apple Moss [Bartramia halleriana]" },
      { id: 122, name: 'Harbour Porpoise [Phocoena phocoena  vomerina]' },
      { id: 123, name: 'Harbour Seal Pacific subspecies [Phoca vitulina  richardsi]' },
      { id: 124, name: 'Horned Grebe [Podiceps auritus]' },
      { id: 125, name: 'Streaked Horned Lark [Eremophila alpestris  strigata]' },
      { id: 126, name: 'Hotwater Physa [Physella wrighti]' },
      { id: 127, name: "Howell's Triteleia [Triteleia howellii]" },
      { id: 128, name: 'Hudsonian Godwit [Limosa haemastica]' },
      { id: 129, name: 'Island Blue [Plebejus saepiolus  insulanus]' },
      { id: 130, name: 'Island Marble [Euchloe ausonides  insulanus]' },
      { id: 131, name: 'Island Tiger Moth [Grammia complicata]' },
      { id: 132, name: "Keen's Long-eared Bat [Myotis keenii]" },
      { id: 133, name: "Kellogg's Rush [Juncus kelloggii]" },
      { id: 134, name: 'Lake Chub [Couesius plumbeus]' },
      { id: 135, name: 'Large-flowered Brickellia [Brickellia grandiflora]' },
      { id: 136, name: "Leiberg's Fleabane [Erigeron leibergii]" },
      { id: 137, name: "Lemmon's Holly Fern [Polystichum lemmonii]" },
      { id: 138, name: 'Leopard Dace [Rhinichthys falcatus]' },
      { id: 139, name: 'Lesser Yellowlegs [Tringa flavipes]' },
      { id: 140, name: "Lewis's Woodpecker [Melanerpes lewis]" },
      { id: 141, name: 'Limber Pine [Pinus flexilis]' },
      { id: 142, name: "Lindley's False Silverpuffs [Uropappus lindleyi]" },
      { id: 143, name: 'Little Brown Myotis [Myotis lucifugus]' },
      { id: 144, name: 'Little Quarry Lake Benthic Threespine Stickleback [Gasterosteus aculeatus]' },
      { id: 145, name: 'Little Quarry Lake Limnetic Threespine Stickleback [Gasterosteus aculeatus]' },
      { id: 146, name: 'Loggerhead Shrike [Lanius ludovicianus]' },
      { id: 147, name: 'Long-billed Curlew [Numenius americanus]' },
      { id: 148, name: 'Long-toed Salamander [Ambystoma macrodactylum]' },
      { id: 149, name: 'Longfin Smelt [Spirinchus thaleichthys]' },
      { id: 150, name: "Lyall's Mariposa Lily [Calochortus lyallii]" },
      { id: 151, name: "Macoun's Meadowfoam [Limnanthes macounii]" },
      { id: 152, name: 'Magnum Mantleslug [Magnipelta mycophaga]' },
      { id: 153, name: 'Marbled Murrelet [Brachyramphus marmoratus]' },
      { id: 154, name: 'Margined Streamside Moss [Scouleria marginata]' },
      { id: 155, name: 'Merlin [Falco columbarius]' },
      { id: 156, name: 'Mexican Mosquito-fern [Azolla mexicana]' },
      { id: 157, name: 'Misty Lake Lentic Threespine Stickleback [Gasterosteus aculeatus]' },
      { id: 158, name: 'Misty Lake Lotic Threespine Stickleback [Gasterosteus aculeatus]' },
      { id: 159, name: 'Monarch [Danaus plexippus]' },
      { id: 160, name: 'Mormon Metalmark [Apodemia mormo]' },
      { id: 161, name: 'Mountain Beaver [Aplodontia rufa]' },
      { id: 162, name: 'Mountain Crab-eye [Acroscyphus sphaerophoroides]' },
      { id: 163, name: 'Mountain Holly Fern [Polystichum scopulinum]' },
      { id: 164, name: 'Mountain Sucker [Catostomus platyrhynchus]' },
      { id: 165, name: "Muhlenberg's Centaury [Centaurium muehlenbergii]" },
      { id: 166, name: "Nelson's Sharp-tailed Sparrow [Ammodramus nelsoni]" },
      { id: 167, name: 'Nine-spotted Lady Beetle [Coccinella novemnotata]' },
      { id: 168, name: 'Nooksack Dace [Rhinichthys cataractae]' },
      { id: 169, name: 'Northern Abalone [Haliotis kamtschatkana]' },
      { id: 170, name: 'Northern Alligator Lizard [Elgaria coerulea]' },
      { id: 171, name: 'Northern Elephant Seal [Mirounga angustirostris]' },
      { id: 172, name: 'Northern Fur Seal [Callorhinus ursinus]' },
      { id: 173, name: 'Northern Goshawk atricapillus subspecies [Accipiter gentilis  atricapillus]' },
      { id: 174, name: 'Northern Goshawk laingi subspecies [Accipiter gentilis  laingi]' },
      { id: 175, name: 'Northern Grey Wolf [Canis lupus  occidentalis]' },
      { id: 176, name: 'Northern Harrier [Circus cyaneus]' },
      { id: 177, name: 'Northern Hawk Owl [Surnia ulula]' },
      { id: 178, name: 'Northern Leopard Frog [Lithobates pipiens]' },
      { id: 179, name: 'Northern Myotis [Myotis septentrionalis]' },
      { id: 180, name: 'Northern Saw-whet Owl brooksi subspecies [Aegolius acadicus  brooksi]' },
      { id: 181, name: 'Northwestern Cellar Spider [Psilochorus hesperus]' },
      { id: 182, name: 'Northwestern Gartersnake [Thamnophis ordinoides]' },
      { id: 183, name: 'Northwestern Salamander [Ambystoma gracile]' },
      { id: 184, name: 'Nugget Moss [Microbryum vlassovii]' },
      { id: 185, name: "Nuttall's Cottontail nuttallii subspecies [Sylvilagus nuttallii  nuttallii]" },
      { id: 186, name: "Nuttall's Sheep Moth [Hemileuca nuttalli]" },
      { id: 187, name: 'Okanagan Efferia [Efferia okanagana]' },
      { id: 188, name: 'Okanogan Stickseed [Hackelia ciliata]' },
      { id: 189, name: 'Oldgrowth Specklebelly Lichen [Pseudocyphellaria rainierensis]' },
      { id: 190, name: 'Olive Clubtail [Stylurus olivaceus]' },
      { id: 191, name: 'Olive-sided Flycatcher [Contopus cooperi]' },
      { id: 192, name: 'Olympia Oyster [Ostrea lurida]' },
      { id: 193, name: 'Oregon Branded Skipper [Hesperia colorado  oregonia]' },
      { id: 194, name: 'Oregon Forestsnail [Allogona townsendiana]' },
      { id: 195, name: 'Oregon Lupine [Lupinus oreganus]' },
      { id: 196, name: 'Oregon Spotted Frog [Rana pretiosa]' },
      { id: 197, name: 'Pacific Gophersnake [Pituophis catenifer  catenifer]' },
      { id: 198, name: 'Pacific Pond Turtle [Actinemys marmorata]' },
      { id: 199, name: 'Pacific Rhododendron [Rhododendron macrophyllum]' },
      { id: 200, name: 'Pacific Water Shrew [Sorex bendirii]' },
      { id: 201, name: 'Pallid Bat [Antrozous pallidus]' },
      { id: 202, name: 'Paxton Lake Benthic Threespine Stickleback [Gasterosteus aculeatus]' },
      { id: 203, name: 'Paxton Lake Limnetic Threespine Stickleback [Gasterosteus aculeatus]' },
      { id: 204, name: 'Peacock Vinyl Lichen [Leptogium polycarpum]' },
      { id: 205, name: 'Peregrine Falcon anatum subspecies [Falco peregrinus  anatum]' },
      { id: 206, name: 'Peregrine Falcon anatum/tundrius [Falco peregrinus  anatum/tundrius]' },
      { id: 207, name: 'Peregrine Falcon pealei subspecies [Falco peregrinus  pealei]' },
      { id: 208, name: 'Phantom Orchid [Cephalanthera austiniae]' },
      { id: 209, name: 'Pink Sand-verbena [Abronia umbellata]' },
      { id: 210, name: 'Pink-footed Shearwater [Ardenna creatopus]' },
      { id: 211, name: 'Pixie Poacher [Occella impi]' },
      { id: 212, name: 'Plains Bison [Bison bison  bison]' },
      { id: 213, name: 'Poor Pocket Moss [Fissidens pauperculus]' },
      { id: 214, name: "Porsild's Bryum [Haplodontium macrocarpum]" },
      { id: 215, name: 'Prairie Falcon [Falco mexicanus]' },
      { id: 216, name: 'Prairie Lupine [Lupinus lepidus]' },
      { id: 217, name: 'Purple Sanicle [Sanicula bipinnatifida]' },
      { id: 218, name: 'Purple Spikerush [Eleocharis atropurpurea]' },
      { id: 219, name: 'Pygmy Pocket Moss [Fissidens exilis]' },
      { id: 220, name: 'Pygmy Short-horned Lizard [Phrynosoma douglasii]' },
      { id: 221, name: 'Pygmy Slug [Kootenaia burkei]' },
      { id: 222, name: 'Pygmy Whitefish [Prosopium coulterii]' },
      { id: 223, name: 'Rabbit-brush Goldenweed [Ericameria bloomeri]' },
      { id: 224, name: 'Rayless Goldfields [Lasthenia glaberrima]' },
      { id: 225, name: 'Red Knot roselaari subspecies [Calidris canutus  roselaari]' },
      { id: 226, name: 'Red Knot roselaari type [Calidris canutus  roselaari]' },
      { id: 227, name: 'Northern Red-legged Frog [Rana aurora]' },
      { id: 228, name: 'Red-necked Grebe [Podiceps grisegena]' },
      { id: 229, name: 'Red-necked Phalarope [Phalaropus lobatus]' },
      { id: 230, name: 'Red-tailed Hawk [Buteo jamaicensis]' },
      { id: 231, name: 'Rigid Apple Moss [Bartramia aprica]' },
      { id: 232, name: 'Rocky Mountain Capshell [Acroloxus coloradensis]' },
      { id: 233, name: 'Rocky Mountain Ridged Mussel [Gonidea angulata]' },
      { id: 234, name: 'Rocky Mountain Sculpin [Cottus  sp.]' },
      { id: 235, name: 'Rocky Mountain Tailed Frog [Ascaphus montanus]' },
      { id: 236, name: "Roell's Brotherella Moss [Brotherella roellii]" },
      { id: 237, name: 'Rosy Owl-clover [Orthocarpus bracteosus]' },
      { id: 238, name: 'Rough-legged Hawk [Buteo lagopus]' },
      { id: 239, name: 'Northern Rubber Boa [Charina bottae]' },
      { id: 240, name: 'Rusty Blackbird [Euphagus carolinus]' },
      { id: 241, name: 'Rusty Cord-moss [Entosthodon rubiginosus]' },
      { id: 242, name: 'Sage Thrasher [Oreoscoptes montanus]' },
      { id: 243, name: 'Salish Sucker [Catostomus sp. cf. catostomus]' },
      { id: 244, name: 'Sand-verbena Moth [Copablepharon fuscum]' },
      { id: 245, name: 'Sandhill Crane tabida subspecies [Grus canadensis  tabida]' },
      { id: 246, name: 'Scarlet Ammannia [Ammannia robusta]' },
      { id: 247, name: "Schleicher's Silk Moss [Entodon schleicheri]" },
      { id: 248, name: "Scouler's Corydalis [Corydalis scouleri]" },
      { id: 249, name: 'Sea Otter [Enhydra lutris]' },
      { id: 250, name: 'Seaside Birds-foot Lotus [Lotus formosissimus]' },
      { id: 251, name: 'Seaside Bone Lichen [Hypogymnia heterophylla]' },
      { id: 252, name: 'Seaside Centipede Lichen [Heterodermia sitchensis]' },
      { id: 253, name: 'Sharp-shinned Hawk [Accipiter striatus]' },
      { id: 254, name: 'Sharp-tailed Snake [Contia tenuis]' },
      { id: 255, name: 'Sheathed Slug [Zacoleus idahoensis]' },
      { id: 256, name: 'Short-eared Owl [Asio flammeus]' },
      { id: 257, name: 'Short-rayed Alkali Aster [Symphyotrichum frondosum]' },
      { id: 258, name: 'Short-tailed Albatross [Phoebastria albatrus]' },
      { id: 259, name: 'Shortface Lanx [Fisherola nuttallii]' },
      { id: 260, name: 'Shorthead Sculpin [Cottus confusus]' },
      { id: 261, name: 'Showy Phlox [Phlox speciosa  ssp. occidentalis]' },
      { id: 262, name: 'Silky Beach Pea [Lathyrus littoralis]' },
      { id: 263, name: 'Silver Hair Moss [Fabronia pusilla]' },
      { id: 264, name: 'Slender Collomia [Collomia tenella]' },
      { id: 265, name: 'Slender Popcornflower [Plagiobothrys tenellus]' },
      { id: 266, name: 'Slender Woolly-heads [Psilocarphus tenellus  var. tenellus]' },
      { id: 267, name: 'Slender Yoke-moss [Zygodon gracilis]' },
      { id: 268, name: 'Small-flowered Lipocarpha [Lipocarpha micrantha]' },
      { id: 269, name: 'Small-flowered Tonella [Tonella tenella]' },
      { id: 270, name: 'Smoker’s Lung Lichen [Lobaria retigera]' },
      { id: 271, name: 'Puget Oregonian [Cryptomastix devia]' },
      { id: 272, name: 'Sockeye Salmon [Oncorhynchus nerka]' },
      { id: 273, name: 'Sonora Skipper [Polites sonora]' },
      { id: 274, name: 'Southern Grey Wolf [Canis lupus  nubilus]' },
      { id: 275, name: 'Southern Maidenhair Fern [Adiantum capillus-veneris]' },
      { id: 276, name: "Spalding's Campion [Silene spaldingii]" },
      { id: 277, name: 'Speckled Dace [Rhinichthys osculus]' },
      { id: 278, name: 'Spoonhead Sculpin [Cottus ricei]' },
      { id: 279, name: 'Spotted Bat [Euderma maculatum]' },
      { id: 280, name: 'Spotted Owl caurina subspecies [Strix occidentalis  caurina]' },
      { id: 281, name: 'Steelhead Trout [Oncorhynchus mykiss]' },
      { id: 282, name: 'Steller Sea Lion [Eumetopias jubatus]' },
      { id: 283, name: 'Stoloniferous Pussytoes [Antennaria flagellaris]' },
      { id: 284, name: 'Streambank Lupine [Lupinus rivularis]' },
      { id: 285, name: 'Suckley’s Cuckoo Bumble Bee [Bombus suckleyi]' },
      { id: 286, name: 'Tall Bugbane [Actaea elata]' },
      { id: 287, name: 'Tall Woolly-heads [Psilocarphus elatior]' },
      { id: 288, name: "Taylor's Checkerspot [Euphydryas editha  taylori]" },
      { id: 289, name: 'Threaded Vertigo [Nearctula  sp.]' },
      { id: 290, name: 'Tiger Salamander [Ambystoma tigrinum]' },
      { id: 291, name: 'Tiny Tassel [Crossidium seriatum]' },
      { id: 292, name: 'Toothcup [Rotala ramosior]' },
      { id: 293, name: "Townsend's Mole [Scapanus townsendii]" },
      { id: 294, name: 'Transverse Lady Beetle [Coccinella transversoguttata]' },
      { id: 295, name: 'Trumpeter Swan [Cygnus buccinator]' },
      { id: 296, name: "Tweedy's Lewisia [Lewisiopsis tweedyi]" },
      { id: 297, name: 'Twisted Oak Moss [Syntrichia laevipila]' },
      { id: 298, name: 'Umatilla Dace [Rhinichthys umatilla]' },
      { id: 299, name: 'Unarmoured Threespine Stickleback [Gasterosteus aculeatus]' },
      { id: 300, name: 'Ute Ladies’–tresses [Spiranthes diluvialis]' },
      { id: 301, name: 'Vananda Creek Benthic Threespine Stickleback [Gasterosteus aculeatus]' },
      { id: 302, name: 'Vananda Creek Limnetic Threespine Stickleback [Gasterosteus aculeatus]' },
      { id: 303, name: 'Vancouver Island Beggarticks [Bidens amplissima]' },
      { id: 304, name: 'Vancouver Island Marmot [Marmota vancouverensis]' },
      { id: 305, name: 'Vancouver Lamprey [Entosphenus macrostomus]' },
      { id: 306, name: 'Coastal Vesper Sparrow [Pooecetes gramineus  affinis]' },
      { id: 307, name: "Victoria's Owl-clover [Castilleja victoriae]" },
      { id: 308, name: 'Vivid Dancer [Argia vivida]' },
      { id: 309, name: "Wallis' Dark Saltflat Tiger Beetle [Cicindela parowana  wallisi]" },
      { id: 310, name: 'Wandering Salamander [Aneides vagrans]' },
      { id: 311, name: 'Warty Jumping-slug [Hemphillia glandulosa]' },
      { id: 312, name: 'Water-plantain Buttercup [Ranunculus alismifolius]' },
      { id: 313, name: 'Western Banded Tigersnail [Anguispira kochi  occidentalis]' },
      { id: 314, name: 'Western Brook Lamprey [Lampetra richardsoni]' },
      { id: 315, name: 'Western Bumble Bee mckayi subspecies [Bombus occidentalis  mckayi]' },
      { id: 316, name: 'Western Bumble Bee occidentalis subspecies [Bombus occidentalis  occidentalis]' },
      { id: 317, name: 'Western Grebe [Aechmophorus occidentalis]' },
      { id: 318, name: 'Western Harvest Mouse megalotis subspecies [Reithrodontomys megalotis  megalotis]' },
      { id: 319, name: 'Western Painted Turtle [Chrysemys picta  bellii]' },
      { id: 320, name: 'Western Rattlesnake [Crotalus oreganus]' },
      { id: 321, name: 'Western Red-backed Salamander [Plethodon vehiculum]' },
      { id: 322, name: 'Western Screech-owl [Megascops kennicottii]' },
      { id: 323, name: 'Western Screech-owl kennicottii subspecies [Megascops kennicottii  kennicottii]' },
      { id: 324, name: 'Western Screech-owl macfarlanei subspecies [Megascops kennicottii  macfarlanei]' },
      { id: 325, name: 'Western Skink [Plestiodon skiltonianus]' },
      { id: 326, name: 'Western Tiger Salamander [Ambystoma mavortium]' },
      { id: 327, name: 'Western Toad [Anaxyrus boreas]' },
      { id: 328, name: 'Western Waterfan [Peltigera gowardii]' },
      { id: 329, name: 'Western Yellow-bellied Racer [Coluber constrictor  mormon]' },
      { id: 330, name: 'Westslope Cutthroat Trout [Oncorhynchus clarkii  lewisi]' },
      { id: 331, name: 'White Meconella [Meconella oregana]' },
      { id: 332, name: 'White Sturgeon [Acipenser transmontanus]' },
      { id: 333, name: 'White-headed Woodpecker [Picoides albolarvatus]' },
      { id: 334, name: 'White-top Aster [Sericocarpus rigidus]' },
      { id: 335, name: 'Whitebark Pine [Pinus albicaulis]' },
      { id: 336, name: "Williamson's Sapsucker [Sphyrapicus thyroideus]" },
      { id: 337, name: 'Wolverine [Gulo gulo]' },
      { id: 338, name: 'Wood Bison [Bison bison  athabascae]' },
      { id: 339, name: 'Woodland Caribou [Rangifer tarandus  caribou]' },
      { id: 340, name: 'Yellow Montane Violet praemorsa subspecies [Viola praemorsa  ssp. praemorsa]' },
      { id: 341, name: 'Yellow Rail [Coturnicops noveboracensis]' },
      { id: 342, name: 'Yellow Scarab Hunter Wasp [Dielis pilipes]' },
      { id: 343, name: 'Yellow-banded Bumble Bee [Bombus terricola]' },
      { id: 344, name: 'Yellow-billed Loon [Gavia adamsii]' },
      { id: 345, name: 'Yellow-breasted Chat auricollis subspecies [Icteria virens  auricollis]' },
      { id: 346, name: 'Yelloweye Rockfish [Sebastes ruberrimus]' }
    ]
  };

  return result;
}
