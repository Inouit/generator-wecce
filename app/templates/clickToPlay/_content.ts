tt_content.<%= params.slugifiedContentName %> = COA
tt_content.<%= params.slugifiedContentName %> {
	1 = HEADERDATA
	1.value (
		<script type="text/javascript" src="typo3conf/ext/skinFlex/<%= params.slugifiedContentName %>/assets/<%= params.slugifiedContentName %>.js"></script>
		<link rel="stylesheet" type="text/css" href="typo3conf/ext/skinFlex/<%= params.slugifiedContentName %>/assets/style.css" media="all">
	)

	5 = < lib.stdheader

	10 = COA
	10 {
		wrap = <div class="<%= params.slugifiedContentName %>Bloc">|</div>

		10 = IMAGE
		10{
			file.import.data = t3datastructure : pi_flexform->file
			file.import.wrap = uploads/skinFlex/<%= params.slugifiedContentName %>/
			#file.maxW = 565m
			#file.maxH = 330m
		}
		
		20 = COA
		20 {
			5 = HTML
			5.value = <div class="infos">

			10 = TEXT
			10{
				data = t3datastructure : pi_flexform->title
				wrap = <h3>|</h3>
			}
			
			20 = TEXT
			20{
				data = t3datastructure : pi_flexform->desc
				wrap = <p class="description">|</p>
				br = 1
			}

			30 = TEXT
			30{
				data = LLL:EXT:skinFlex/<%= params.slugifiedContentName %>/locallang.xml:tt_content.<%= params.slugifiedContentName %>.btnLabel
				stdWrap.typolink{
					parameter = javascript:;
					ATagParams = class="play"
				}
				wrap = <p>|</p>
			}

			35 = HTML
			35.value = </div>
		}
		

		30 = TEXT
		30{
			data = t3datastructure : pi_flexform->video
			wrap = <iframe class="player" width="100%" height="100%" future_src="|?autoplay=1" frameborder="0" allowfullscreen></iframe>

			stdWrap.replacement {
			    10 {
			      search = watch?v=
			      replace = embed/
			    }
			  }
			}
		}
	}
}
