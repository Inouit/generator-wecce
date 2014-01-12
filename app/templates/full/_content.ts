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
		}

		20 = TEXT
		20{
			data = t3datastructure : pi_flexform->title
		}
			
		30 = TEXT
		30{
			data = t3datastructure : pi_flexform->desc
			stdWrap.parseFunc < lib.parseFunc_RTE
		}

		40 = FFSECTION
		40 {
			rootPath = t3datastructure : pi_flexform->loopItems/el

			10 = COA
			10{
				#flexformSection : loopItem/el/myItem
			}
		}
	}
}
