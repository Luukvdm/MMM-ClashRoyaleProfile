# MMM-ClashRoyaleProfile
This is a module for the [MagicMirror](https://github.com/MichMich/MagicMirror) that shows your Clash Royale profile.

## Example

![example](https://user-images.githubusercontent.com/25098818/42462833-b31bffba-83a4-11e8-8803-f80fd4e649a9.png)

## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone the repository:
````
git clone https://github.com/Luukvdm/MMM-ClashRoyaleProfile.git
````

Add the module to the modules array in the `config/config.js` file:
````javascript
  {
    module    : 'MMM-ClashRoyaleProfile',
    position  : 'middle_center',
    config    :
    {
      devKey      : 'your devkey',
      profileTag  : 'your profile tag',
      greyScale   : true
    }
  },
````

For more information read [the Magic Mirror Github page](https://github.com/MichMich/MagicMirror)

## Config Options
| **Option** | **Default** | **Description** |
| --- | --- | --- |
| `devKey` |  | The devkey that is used to acces the api see the [Royal Api Docs](https://docs.royaleapi.com/#/authentication) on how to get a new key. |
| `profileTag` |  | Your Clash Royale profile tag **withouth the #**. |
| `animationSpeed` | 1000 | **Optional** The speed (in milliseconds) of the animations. |
| `grayscale` | false | **Optional** Should the images be shown in grayscale?  |
| `battleListLength` | 5 | **Optional** The amount of recent battles to display.  |
| `updateInterval` | 300000 (5 minutes) | **Optional** How often does the data needs to be reloaded from the API? (Milliseconds).  |

## Updating

To update the module to the latest version, use your terminal to go to your MMM-ClashRoyaleProfile module folder and type the following command:

````
git pull
```` 

If you haven't changed the modules, this should work without any problems. 
Type `git status` to see your changes, if there are any, you can reset them with `git reset --hard`. After that, git pull should be possible.
