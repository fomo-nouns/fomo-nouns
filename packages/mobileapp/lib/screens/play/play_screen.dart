import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mobileapp/screens/shared_widgets/helper.dart';

class PlayScreen extends StatelessWidget {
  const PlayScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const MaterialWidget(
      child: Center(
        child: Text("Play Screen"),
      ),
    );
  }
}
