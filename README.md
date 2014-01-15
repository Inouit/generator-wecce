# generator-wecce
A [Yeoman][1] generator of Flexible Content Element (with [WEC Content Elements][2]) for [Typo3 CMS (4.x)][3].

## Requirements

 - [WEC Content Elements][2] with *skin_dummy* hook installed in your [Typo3 CMS (4.x)][3]
 - some conf in your plugin configuration :
     - **ext_emconf** => 'createDirs' => '',
     - **ext_localconf.php** => // ## insert here
     - **ext_tables.php** => // ## insert here

## Let's go
### Install the generator
    git clone git@github.com:in8/generator-wecce.git
    cd generator-wecce
    npm link

### Launch the generator
    yo wecce

### Follow instructions and build your own content element
#### Choose the type of custom element
    [?] Content element type: (Use arrow keys)
    ‣ Create a custom content element           // -> Make a custom element one field after another (Noobs don't have to be ashamed)
    --------
    Based on Click to Play Youtube video        // -> Copy a *Click To play youtube* element
    Based on Image Caption                      // -> Copy a *Image Caption* element
    Full content element                        // -> Copy an element filled with all kind of fields (you're a bit lazy)
    Empty content element                       // -> Copy the basic structure (you're crazy but a pro for sure)
    --------
    Exit                                        // -> I let you guess
#### Loop on the custom fields you want to insert
    [?] Do you wan't another item? (Use arrow keys)
    ‣ Input                                     // -> Insert an input field
    Textarea                                    // -> Insert an textarea field
    Textarea with RTE                           // -> Insert an textarea field with Wysiwyg configuration
    Image                                       // -> Insert an image field
    Loop                                        // -> Insert an loop configuration
    No thanks, that's enough.                   // -> Generate all fields that you've chosen before

  [1]: http://yeoman.io
  [2]: http://typo3.org/extensions/repository/view/wec_contentelements
  [3]: http://typo3.org/