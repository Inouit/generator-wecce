tt_content.<%= validVariableName %> = COA
tt_content.<%= validVariableName %> {
	5 = < lib.stdheader

	# Draw each image in the <%= validVariableName %>.
	10 = FFSECTION
	10 {
		rootPath = t3datastructure : pi_flexform->images/el
		wrap = |<div class="arrow"></div>

		10 = COA
		10{
			wrap = <div class="item">|</div>

			10 = IMAGE
			10 {
				file.import.data = flexformSection : image/el/file
				file.import.wrap = uploads/skinFlex/<%= validVariableName %>/
			}

			20 = TEXT
			20{
				data = flexformSection : image/el/name
				wrap = <h3>|</h3>
				required = 1
			}
		}
	}
}
